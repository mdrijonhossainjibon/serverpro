import { NOSQL } from "Database";
import { NextFunction, Router } from "express";
import { sendJSONResponse } from "responseHandler";

export const adjustmentRouter = Router();

adjustmentRouter.get('/', async (req, res, next : NextFunction) => {
    try {
        const allPermission = await NOSQL.SocialMediaUser.find() 
        sendJSONResponse({ res, result: allPermission });
    } catch (error) {
        next(error);
    }
});