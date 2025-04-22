# eduMate - Learning Analytics Module

A comprehensive learning analytics module built with React (Vite) and Node.js, featuring time tracking, knowledge gap detection, performance visualization, and academic CV generation.

## Features

- **Time Tracking**: Track time spent on each topic (start, end, duration)
- **Knowledge Gap Detection**: Identify weak areas based on quiz/test scores
- **Performance Visualization**: View performance through charts
- **Achievement System**: Earn badges for consistency and performance
- **CV Generator**: Create exportable academic CVs in PDF or JSON format

## Tech Stack

### Frontend
- React (Vite)
- JavaScript
- React Router for navigation
- Chart.js for data visualization
- jsPDF for PDF generation

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- RESTful API architecture

## Project Structure

```
eduMate/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   │   ├── achievements/ # Achievement-related components
│   │   ├── analytics/    # Analytics and data visualization
│   │   ├── cv/           # CV generation components
│   │   └── learning/     # Learning tracking components
│   ├── pages/            # Page components
│   ├── services/         # API service modules
│   ├── context/          # React context providers
│   └── assets/           # Static assets
├── server/               # Backend source code
│   ├── models/           # Mongoose models
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   └── config/           # Server configuration
└── public/               # Static public files
```

## Setup and Installation

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd eduMate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/edumate
   ```

4. Start the development servers:
   ```
   npm run dev:all
   ```

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run server` - Start the backend server
- `npm run dev:all` - Start both frontend and backend servers

## API Endpoints

### Learning Time Tracking
- `POST /api/learning-time/start` - Start a learning session
- `PUT /api/learning-time/end/:sessionId` - End a learning session
- `GET /api/learning-time/summary` - Get learning time summary
- `GET /api/learning-time/logs` - Get detailed learning time logs
- `GET /api/learning-time/by-topic` - Get time spent by topic
- `GET /api/learning-time/recent` - Get recent learning sessions

### Knowledge Gaps
- `GET /api/knowledge-gaps` - Get all knowledge gaps
- `GET /api/knowledge-gaps/topic/:topicId` - Get gaps for a specific topic
- `GET /api/knowledge-gaps/:gapId/recommendations` - Get improvement recommendations
- `PUT /api/knowledge-gaps/:gapId/status` - Update a gap's status
- `POST /api/knowledge-gaps/analyze` - Analyze a test result

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/recent` - Get recent achievements
- `GET /api/achievements/streak` - Get streak information
- `GET /api/achievements/possible` - Get possible achievements
- `POST /api/achievements/check` - Check for new achievements
- `PUT /api/achievements/:achievementId/viewed` - Mark as viewed

### CV Generator
- `GET /api/cv-generator` - Get CV data
- `PUT /api/cv-generator` - Update CV information

## License

MIT 