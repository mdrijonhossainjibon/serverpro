import { NOSQL } from "Database";
import { NextFunction, Router } from "express";
import { sendJSONResponse } from "responseHandler";

export const configurationRouter = Router();

configurationRouter.get('/', async (req, res, next : NextFunction) => {
    try {
        const allPermission = await NOSQL.SocialMediaUser.find() 
        sendJSONResponse({ res, result: allPermission });
    } catch (error) {
        next(error);
    }
});

///NOSQL.SocialMediaUser.create({ provider : 'google' , providerId : '109113138013-tv5kg8bh40tub6lgqi1tpm5jofvn2dis.apps.googleusercontent.com'}) 