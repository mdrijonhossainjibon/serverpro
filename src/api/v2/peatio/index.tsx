import { Router } from "express";
import { publicRouters } from "./public";
import { marketRouter } from "./market";
import { accountRouter } from "./account";

export const peatioRouter = Router();


peatioRouter.use('/public' , publicRouters);

peatioRouter.use('/market' , marketRouter);
peatioRouter.use('/account' , accountRouter);