import { Router } from "express";
import { peatioRouter } from './peatio';
import { barongRouter } from "./barong";
import { adminRouter } from "./admin";

export const apiV2Router = Router();


apiV2Router.use('/peatio' , peatioRouter );
apiV2Router.use('/barong' , barongRouter)

apiV2Router.use('/admin' , adminRouter)
 