import { Router } from "express";
import { sessionsRouter } from "./sessions";
import { pingRouter } from "./ping";
import { configsRouter } from "./configs";
import { usersRouter } from "./users";

export const identityRouter = Router();

identityRouter.use('/sessions' , sessionsRouter);
identityRouter.use('/ping' , pingRouter);
identityRouter.use('/configs' , configsRouter);
identityRouter.use('/users' , usersRouter);