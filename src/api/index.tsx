import { Router } from "express";
import { apiV2Router } from "./v2";

export const apiRouter = Router();



apiRouter.use('/v2' , apiV2Router)