import { Router } from "express";
import { devopsRouter } from "./devops";
import { permissionMiddleware } from "Middleware/permissionMiddleware";
import { usersRouter } from "./users";
import { configurationRouter } from "./configuration";

export const adminRouter = Router();

adminRouter.use('/devops' , permissionMiddleware, devopsRouter);
adminRouter.use('/users' , usersRouter);
adminRouter.use('/configuration' , configurationRouter);