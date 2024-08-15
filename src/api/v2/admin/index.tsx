import { Router } from "express";
import { devopsRouter } from "./devops";

export const adminRouter = Router();

adminRouter.use('/devops' , devopsRouter)