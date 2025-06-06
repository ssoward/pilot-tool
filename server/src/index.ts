import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { testConnection, syncDatabase } from './config/database';

// Load environment variables
config();

// Create Express server
const app = express();

// Set security headers with Helmet
app.use(helmet());

// Enable CORS
app.use(cors());

// Request logging
app.use(morgan('dev'));

// Parse JSON requests
app.use(express.json());

// Rate limiting - disabled in development
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API version endpoint
app.get('/api/version', (req, res) => {
  res.status(200).json({ version: '1.0.0' });
});

// Import routes here
import initiativeRoutes from './routes/initiativeRoutes';
import aiRoutes from './routes/aiRoutes';
import teamRoutes from './routes/teamRoutes';
import roadmapRoutes from './routes/roadmapRoutes';

app.use('/api/initiatives', initiativeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', teamRoutes);
app.use('/api', roadmapRoutes);

// Default catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database
    await syncDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
