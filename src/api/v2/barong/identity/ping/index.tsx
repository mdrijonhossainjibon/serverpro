import { Router } from "express";

export const pingRouter = Router();


pingRouter.get('/', ((req, rep) => { rep.json({ "ping": "pong" })}));