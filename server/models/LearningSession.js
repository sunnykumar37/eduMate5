import mongoose from 'mongoose';

const learningSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Calculate duration when session ends
learningSessionSchema.pre('save', function(next) {
  if (this.endTime && !this.duration) {
    this.duration = Math.round((this.endTime - this.startTime) / 1000);
    this.completed = true;
  }
  next();
});

// Virtual for formatting duration as hours
learningSessionSchema.virtual('durationHours').get(function() {
  return (this.duration / 3600).toFixed(2);
});

// Method to get today's total time spent for a user
learningSessionSchema.statics.getTodayTimeForUser = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        startTime: { $gte: today, $lt: tomorrow },
        completed: true
      }
    },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: "$duration" }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalDuration : 0;
};

// Method to get week's total time spent for a user
learningSessionSchema.statics.getWeekTimeForUser = async function(userId) {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  const day = today.getDay() || 7; // Make Sunday 7
  firstDayOfWeek.setDate(today.getDate() - day + 1); // Set to Monday
  firstDayOfWeek.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(firstDayOfWeek);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const result = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        startTime: { $gte: firstDayOfWeek, $lt: nextWeek },
        completed: true
      }
    },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: "$duration" }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalDuration : 0;
};

const LearningSession = mongoose.model('LearningSession', learningSessionSchema);

export default LearningSession; 