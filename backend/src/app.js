import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection middleware (essential for Serverless/Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'https://travelmindai.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith('.vercel.app') ||
                        (env.CLIENT_URL && origin === env.CLIENT_URL.replace(/\/$/, ''));
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TravelMind AI API is running 🚀' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/chat', chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
