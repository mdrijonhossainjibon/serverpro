import { Router } from "express";
import { sessionsRouter } from "./sessions";
import { pingRouter } from "./ping";
import { configsRouter } from "./configs";
import { usersRouter } from "./users";
import { permissionMiddleware } from "Middleware/permissionMiddleware";

export const identityRouter = Router();

identityRouter.use('/sessions' , permissionMiddleware ,  sessionsRouter);
identityRouter.use('/ping' , permissionMiddleware , pingRouter);
identityRouter.use('/configs' , permissionMiddleware , configsRouter);
identityRouter.use('/users' , permissionMiddleware , usersRouter);