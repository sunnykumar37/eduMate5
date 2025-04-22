import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import learningTimeRoutes from './routes/learningTimeRoutes.js';
import knowledgeGapsRoutes from './routes/knowledgeGapsRoutes.js';
import achievementsRoutes from './routes/achievementsRoutes.js';
import cvGeneratorRoutes from './routes/cvGeneratorRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/learning-time', learningTimeRoutes);
app.use('/api/knowledge-gaps', knowledgeGapsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/cv-generator', cvGeneratorRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('eduMate API is running');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edumate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app; 