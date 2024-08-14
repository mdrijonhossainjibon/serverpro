import { Router } from "express";

export const configsRouter = Router();


configsRouter.get('/', ((req, rep) => {
    rep.json({
        "session_expire_time": 5000,
        "captcha_type": "none",
        "captcha_id": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
        "password_min_entropy": 14
    })
}));