import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// Fixed typo 'constanst'
import { NOSQL } from 'Database'; // Ensure NOSQL is correctly configured
import { IPermission } from 'Database/types';
import { UserPermissionAction, UserPermissionVerb } from 'constanst/permissions';
import { sendJSONResponse } from 'responseHandler';

const patternToRegex = (pattern: string) => {
  const regexPattern = pattern
    .replace(/:[^\s/]+/g, '([^/]+)')  // Replace URL params (e.g., :id) with regex capturing groups
    .replace(/\*/g, '.*');            // Replace wildcards with regex
  return new RegExp(`^${regexPattern}$`);
};


const patternToReget = (pattern: string): RegExp => {
  // Escape special tregex characters and replace dynamic segments (e.g., :id) with regex patterns
  const escapedPattern = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // Replace dynamic segments (e.g., :id, :name) with regex pattern [^/]+
  let regexPattern = escapedPattern.replace(/\\:([a-zA-Z0-9_]+)/g, '[^/]+');
  
  // Handle optional query parameters like ?token=value
  if (regexPattern.includes('?')) {
    regexPattern = regexPattern.replace(/\\\?([a-zA-Z0-9_]+)=([^&]+)/g, '(\\?$1=$2)?');
  }
  
  return new RegExp(`^${regexPattern}$`);
}
// Check if the user has the required permissions
const checkPermissions = (permissions: IPermission[], url: string, method: string, params?: {}) => {




  return permissions.some(user => {
    const pattern = patternToRegex(user.url);
    const match = url.match(pattern);

     if(url.match(patternToRegex('/api/v2/admin/devops/:id'))?.[0]){
      return user.verb  === method && user.action === UserPermissionAction.Drop
     }

   

  })
 
};


///if (match) {
 // return user.verb === method && (user.action !== UserPermissionAction.Drop)
///}

declare global {
  namespace Express {
      interface Request {
          user?:  any;
      }
  }
}


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
      return next()
  }
 

  jwt.verify(authHeader, process.env.JWT_SECRET || 'default-secret', (err, user) => {
      if (err) {
          return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user; // Attach the user object to the request
      next();
  });
};


// Middleware to check permissions
export const permissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  next()
};

 