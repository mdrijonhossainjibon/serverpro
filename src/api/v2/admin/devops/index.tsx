import { Router } from "express";
import { NOSQL } from "Database";
import { sendJSONResponse } from "responseHandler";
export const devopsRouter = Router();



devopsRouter.get('/', async (req, res, next) => {
    try {
        const allPermission = await NOSQL.Permission.find().sort({ create_at: -1 });

        sendJSONResponse({ res, result: allPermission });

    } catch (error) {
        next(error)
    }
})