import { Router } from "express";
import { balancesRouter } from "./balances";
import { deposit_addressRouter } from "./deposit_address";

export const accountRouter = Router();

accountRouter.use('/balances' , balancesRouter);

accountRouter.use('/deposit_address' , deposit_addressRouter)