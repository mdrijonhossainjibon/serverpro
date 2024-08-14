import { UserPermissionAction, UserPermissionVerb } from 'constanst/permissions';
import { Router, Request, Response, NextFunction } from 'express';
import { permissionMiddleware } from 'Middleware/permissionMiddleware';
import { restrictionMiddleware } from 'Middleware/restrictionMiddleware';
import { RestrictionCategory, RestrictionScope } from 'Restrictions/restrictions';
 

const privateRouter = Router();

// Example private route with permission check
//privateRouter.get("/secure", permissionMiddleware(UserPermissionAction.Audit, UserPermissionVerb.GET), (req: Request, res: Response, next: NextFunction) => {
//  try {
 //   res.json({ msg: "Access granted to secure route" });
  //} catch (error) {
 //   next(error);
 // }
///});



privateRouter.get("/restricted", restrictionMiddleware(RestrictionScope.Ip, RestrictionCategory.Blacklist, '192.168.1.1'), (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ msg: "Access granted to restricted route" });
    } catch (error) {
      next(error);
    }
  });



export default privateRouter;
