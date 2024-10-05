import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sendJSONResponse } from './responseHandler';
import rateLimit from 'express-rate-limit';
import { authenticateToken, permissionMiddleware } from 'Middleware/permissionMiddleware';
import { apiRouter } from 'api';
import cors from 'cors';
import bodyParser from 'body-parser';

import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';


import 'webSooket';

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 100 requests per `windowMs`
  message: { code: -10002, error: 'Rate limit exceeded. Please wait before making another request.' }
});

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
///app.use(authenticateToken);

mongoose.connect('mongodb+srv://admin:admin@atlascluster.nei8u.mongodb.net/demo', {})
  .then(() => console.log("[mongoDB]: DB Connection Successful"))
  .catch(err => console.error("[mongoDB]: MongoDB connection error", err));

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());

// Middleware for checking server health
const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  sendJSONResponse({ res, message: { success: 'Server is up and running' } });
};

// Middleware for getting server time
const serverTime = (req: Request, res: Response, next: NextFunction) => {
  sendJSONResponse({ res, message: { success: new Date().toISOString(), code: -10000 } });
};

// Routes
app.get("/", permissionMiddleware, (req: Request, res: Response, next: NextFunction) => {
  try {
    sendJSONResponse({ res, message: { success: 'Ping Successful', code: -10000 }, description: 'The server is up and reachable.' });
  } catch (error) {
    next(error);
  }
});

// Health Check API
app.get("/health", permissionMiddleware, healthCheck);

// Server Time API
app.get("/servertime", permissionMiddleware, serverTime);

app.use('/api', apiRouter);

// Custom Error Handling Middleware
class AppError extends Error {
  public statusCode: number;
  public isOperational?: any;

  constructor(statusCode: number, message: string, isOperational ? : string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err;
  sendJSONResponse({
    res,
    message: { error: message, code: -10014 },
    description: 'The server encountered an unexpected condition that prevented it from fulfilling the request. We apologize for the inconvenience. Our team is working to resolve the issue as quickly as possible.',
    details: {
      errorType: err.isOperational  ||  'ServerException',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  sendJSONResponse({
    res,
    message: { code: -10001, error: 'Resource not found' },
    details: { resource: `${req.originalUrl}`, errorType: 'NotFoundException' },
    description: 'The resource you are trying to access could not be found. Please check the URL or resource identifier and try again.'
  });
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

 
