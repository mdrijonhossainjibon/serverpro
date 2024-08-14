import { Router } from "express";
import { tradesRouter } from "./trades";
 

export const marketRouter = Router();

 marketRouter.use('/trades' ,   tradesRouter)