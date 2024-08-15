import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sendJSONResponse } from './responseHandler';
import rateLimit from 'express-rate-limit';
import { permissionMiddleware } from 'Middleware/permissionMiddleware';
import { apiRouter } from 'api';
import cors from 'cors';
import bodyParser from 'body-parser';
 
// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: { code: -10002, error: 'Rate limit exceeded. Please wait before making another request.'   }
});




dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());



mongoose.connect('mongodb+srv://admin:admin@atlascluster.nei8u.mongodb.net/demo', {}).then(() => console.log("[mongoDB]: DB Connection Successful")).catch(err => console.error("[mongoDB]: MongoDB connection error", err));
// Apply the rate limiting middleware to all requests
app.use(limiter);
// Middleware to handle errors
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  sendJSONResponse( { res,
    
    "message": { error : 'Internal Server Error.' , code : -10014 },
    "description": "The server encountered an unexpected condition that prevented it from fulfilling the request. We apologize for the inconvenience. Our team is working to resolve the issue as quickly as possible.",
    "details": {
      "errorType": "ServerException",
      timestamp : new Date().toISOString( )
    }
  }
  );
};

// Middleware for checking server health
const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  sendJSONResponse( { res , message : { success : 'Server is up and running '}});
};

// Middleware for getting server time
const serverTime = (req: Request, res: Response, next: NextFunction) => {
 
  sendJSONResponse({  res , message : {  success : new Date().toISOString() , code :  -10000 }   });
};

//app.use(restrictionMiddleware1(  RestrictionScope.Country, RestrictionCategory.Blacklist), (req, res , next) => {
//  next()
//});


 


app.get("/", permissionMiddleware , (req: Request, res: Response, next: NextFunction) => {
   
  try {
    sendJSONResponse({ res , message : { success : 'Ping Successful' , code : -10000   } , description : 'The server is up and reachable.'  });
  } catch (error) {
    next(error);
  }
});

// Health Check API
app.get("/health",permissionMiddleware ,  healthCheck);

// Server Time API
app.get("/servertime"  , permissionMiddleware , serverTime);

app.use('/api' , apiRouter )



//app.get('/api/v1/private/identity/email/verify/:token', permissionMiddleware , (req , res) => res.json({ ok : 'pk'}));
  

// Apply the error handling middleware
app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  const details = `The resource you are trying to access could not be found. Please check the URL or resource identifier and try again`;
  sendJSONResponse({ res, message : { code : -10001 , error : 'Resource not found'}  , details : { resource : `${req.originalUrl}` , errorType : 'NotFoundException'  }, description : details});
});


const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
 