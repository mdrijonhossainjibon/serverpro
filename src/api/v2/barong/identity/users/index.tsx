import { Router } from "express";

export const usersRouter = Router();


usersRouter.get('/', ((req, rep) => {
    rep.json({
        created_at: "2021-08-30T14:12:19Z",
        csrf_token: "738cf6284d8b9e24ab99",
        data: "{\"language\":\"en\"}",
        data_storages: [],
        email: "hoctapdtu5443zz@gmail.com",
        labels: [],
        level: 0,
        otp: false,
        phones: [],
        profiles: [],
        referral_uid: null,
        role: "member",
        state: "pending",
        uid: "ID61C775D64B",
        updated_at: "2021-08-30T14:12:19Z",
        username: null,
    }
    )
}))