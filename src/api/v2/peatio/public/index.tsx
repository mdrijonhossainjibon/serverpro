import { Router } from "express";
import { currenciesRouter } from "./currencies";
import { permissionMiddleware } from "Middleware/permissionMiddleware";
import { marketsRouter } from "./markets";
import { CaptchaRouter } from "./captcha";
import { memberLevelsRouter } from "./member-levels";

export const publicRouters = Router();


publicRouters.use('/currencies' , permissionMiddleware,  currenciesRouter);

publicRouters.use('/markets' , permissionMiddleware , marketsRouter);
publicRouters.use('/member-levels', memberLevelsRouter);

publicRouters.use('/geetest' , permissionMiddleware ,    CaptchaRouter);




