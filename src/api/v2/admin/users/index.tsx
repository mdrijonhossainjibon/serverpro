import { Router } from "express";
import { NOSQL } from "Database";
import { sendJSONResponse } from "responseHandler";

export const usersRouter = Router();


usersRouter.get('/', async (req, res, next) => {
    try {
        const data = await NOSQL.UserModel.find();
        const result: any[] = []

        for (let user of data) {
            const datas = {
                email: user.email,
                uid: user.uid,
                
                role: user.role,
                level: user.level,
                referral_uid: user.referral_uid,
                data: user.data,
                two_factor_auth: user.two_factor_auth,
                profile: [],
                labels: [],
                documents: [],
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at
            };

            result.push(datas)
        }
        sendJSONResponse({ res, result });
    } catch (error) {
        next(error);
    }
});


usersRouter.get('/activities', async (req, res, next) => {
    try {
        const result = await NOSQL.UserActivity.find({ uid: 'ID9NLOSN91004' });
        sendJSONResponse({ res, result });
    } catch (error) {
        next(error);
    }
});


