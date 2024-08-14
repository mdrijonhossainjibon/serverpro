import { Router } from "express";
import { identityRouter } from "./identity";

export const barongRouter = Router();

barongRouter.use('/identity' , identityRouter);
