import { Request, Response, NextFunction } from 'express';
// Fixed typo 'constanst'
import { NOSQL } from 'Database'; // Ensure NOSQL is correctly configured
import { IPermission } from 'Database/types';
import { UserPermissionAction, UserPermissionVerb } from 'constanst/permissions';

const patternToRegex = (pattern: string) => {
  const regexPattern = pattern
    .replace(/:[^\s/]+/g, '([^/]+)')  // Replace URL params (e.g., :id) with regex capturing groups
    .replace(/\*/g, '.*');            // Replace wildcards with regex
  return new RegExp(`^${regexPattern}$`);
};

// Check if the user has the required permissions
const checkPermissions = (permissions: IPermission[], url: string, method: string, params?: {}) => {




  return permissions.some(user => {
    const pattern = patternToRegex(user.url);
    const match = url.match(pattern);


    if (user.url === url) { return user.url.includes(url) && ( user.verb === method ) && (user.action !== UserPermissionAction.Drop) };

    if (match) {
      return user.verb === method && (user.action !== UserPermissionAction.Drop)
    }

  })

};

function getHeader(req : Request ) {
   console.log(req.headers)
}




// Middleware to check permissions
export const permissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
 
    
  try {
    const url = req.originalUrl;
    const match = url.match(/public|private/);
   

    const users = await NOSQL.Permission.find({ role: match ? match[0] :  'admin' }).exec();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Unauthorized: No user information available' });
    }
   
 

   
    const method = req.method as UserPermissionVerb; // Ensure this matches the enum type
    const params = req.params;

    if (checkPermissions(users, url, method, params)) {
      return next();
    } else {
      return res.status(403).json({
        code: -10007,
        status: 'error',
        message: 'Access to the requested URL is blocked or permission is denied. Please check your permissions or contact support for assistance.',
        description: 'The URL you are trying to access may be restricted based on your account permissions or geographical location. Ensure you have the correct permissions or contact support for help.'
      });
    }
  } catch (error) {
    console.error('Error in permission middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
