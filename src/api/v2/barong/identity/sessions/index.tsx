import { NOSQL } from "Database";
import { Router } from "express";
import bcrypt from 'bcrypt';
import { API_CALL, TypeApiPromise } from "api_Call";
import jwt from 'jsonwebtoken';
import { sendJSONResponse } from "responseHandler";
import { SMTP_SERVICE } from "../users/SMTP";

import { UAParser } from "ua-parser-js";
import { randomBytes } from "crypto";




export const sessionsRouter = Router();








export const EMAIL_REGEX = /^(?:[\w!#$%&'*+/=?^`{|}~]+\.)*[\w!#$%&'*+/=?^`{|}~]+@(gmail\.com|yahoo\.com|hotmail\.com)$/i;


export const PASSWORD_REGEX = /^(?=.{8,})/;

const EmailSend = new SMTP_SERVICE()


sessionsRouter.post('/', async (req, rep, next) => {
    try {
        const { email, password, otp_code, hash } = req.body;
        const user_agent = req.headers['user-agent'] || '';
        const ip = req.ip as string;
        const ipv4Regex = /(?:\d{1,3}\.){3}\d{1,3}/;
        const match = ip.match(ipv4Regex);
        const ua = new UAParser(user_agent);

        const user_ip = match?.[0] || ip;

        const os = (data?: object, state: string = 'pending') => {
            const osName = ua.getOS().name;
            if (data) {
                return { ...data };
            }
            switch (osName) {
                case 'Windows':
                    return { "note": `Login ${state} on PC` };
                case 'Android':
                    return { "note": `Login ${state} on Android` };
                case 'Mac OS':
                    return { "note": `Login ${state} on MacBook` };
                case 'iOS':
                    return { "note": `Login ${state} on iPhone` };
                default:
                    return { "note": `Login ${state} on Unknown OS` };
            }
        };

        const txhash = randomBytes(64).toString('hex');

        if (hash) {
            const { response, status }: TypeApiPromise = await API_CALL({
                baseURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
                method: 'post', 
                headers: { Authorization: hash }
            });

            if (status === 200 && response) {
                const user = await NOSQL.UserModel.findOne({ email: response.email }).select([
                    'email', 'uid', 'role', 'level', 'referral_uid', 'data', 'two_factor_auth', 'status', 'created_at', 'updated_at'
                ]);

                if (!user) {
                    return rep.status(403).json({
                        "api-version": "1.0",
                        statusCode: 403,
                        message: { error: 'identity.user_doesnt_exist' }
                    });
                }

                if (['accountant', 'superadmin', 'admin', 'support', 'technical'].includes(user.role)) {
                    if (!user.two_factor_auth) {
                        if (user.status === 'active') {
                            const data = {
                                email: user.email, uid: user.uid, avater: response.picture, role: user.role, level: user.level, referral_uid: user.referral_uid,
                                data: user.data, two_factor_auth: user.two_factor_auth, status: user.status, created_at: user.created_at, updated_at: user.updated_at
                            };

                            const token = jwt.sign({ user: data }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
                            const result = { ...data, phones: {}, profiles: {}, csrf_token: token };

                            return rep.json({
                                "api-version": "2.0",
                                statusCode: 200,
                                message: { success: 'page.header.signUp.message.success' },
                                result: { user: result }
                            });
                        }
                        return rep.status(403).json({
                            "api-version": "1.0",
                            statusCode: 403,
                            message: { error: `identity.session.${user.status}` }
                        });
                    }
                    // Handle two-factor authentication...
                }

                if (user.role === 'member') {
                    if (!user.two_factor_auth) {
                        if (user.status === 'active') {
                            const UserActivity = await NOSQL.UserActivity.findOne({ user_ip, uid: user.uid });

                            if (!UserActivity) {
                                await NOSQL.UserActivity.create({
                                    user_agent, data: JSON.stringify(os()), action: 'login', topic: "session", result: 'succeed', user_ip, token: txhash, uid: user.uid
                                });
                                await EmailSend.sendVerificationEmail({
                                    to: response.email,
                                    subject: 'Email Verification',
                                    link: `${process.env.BASE_URL || undefined}/email/verified/${txhash}/${user.uid}`
                                });

                                return rep.status(403).json({
                                    "api-version": "1.0",
                                    statusCode: 403,
                                    message: { error: `identity.session.ipdetect` }
                                });
                            }

                            if (UserActivity.result === 'pending') {
                                return rep.status(403).json({
                                    "api-version": "1.0",
                                    statusCode: 403,
                                    message: { error: `identity.session.ipdetect` }
                                });
                            }

                            const data = {
                                email: user.email, uid: user.uid, avater: response.picture, role: user.role, level: user.level, referral_uid: user.referral_uid,
                                data: user.data, two_factor_auth: user.two_factor_auth, status: user.status, created_at: user.created_at, updated_at: user.updated_at
                            };
                            const token = jwt.sign({ user: data }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '1h' });
                            const result = { ...data, phones: {}, profiles: {}, csrf_token: token };

                            return rep.json({
                                "api-version": "2.0",
                                statusCode: 200,
                                message: { success: 'page.header.signUp.message.success' },
                                result: { user: result }
                            });
                        }
                        return rep.status(403).json({
                            "api-version": "1.0",
                            statusCode: 403,
                            message: { error: `identity.session.${user.status}` }
                        });
                    }
                }

                return rep.status(403).json({
                    "api-version": "1.0",
                    statusCode: 403,
                    message: { error: 'page.header.admin.permissions.error' }
                });
            }
        }

        if (!email) {
            return rep.status(400).json({
                "api-version": "1.0",
                statusCode: 400,
                message: { error: 'identity.login.email_empty' }
            });
        }
        if (!password) {
            return rep.status(400).json({
                "api-version": "1.0",
                statusCode: 400,
                message: { error: 'identity.login.password_empty' }
            });
        }

        if (typeof email !== 'string' || typeof password !== 'string') {
            return rep.status(400).send({
                message: { error: 'page.body.profile.content.action.typeof.miss' }
            });
        }

        if (!email.match(EMAIL_REGEX)) {
            return rep.status(400).send({
                message: { error: 'page.body.profile.content.action.login' }
            });
        }
        if (!password.match(PASSWORD_REGEX)) {
            return rep.status(400).send({
                message: { error: 'page.header.signUp.password.message.error' }
            });
        }

        const user = await NOSQL.UserModel.findOne({ email });
        if (!user) {
            return rep.status(403).json({
                "api-version": "1.0",
                statusCode: 403,
                message: { error: 'identity.identity.user_doesnt_exist' }
            });
        }

        const hashedPassword = await bcrypt.compare(password, user.password);
        if (!hashedPassword) {
            return rep.status(401).json({
                "api-version": "1.0",
                statusCode: 401,
                message: { error: 'identity.user.passwords_doesnt_match' }
            });
        }
        if (!user.two_factor_auth) {
            if (user.status === 'active') {
                if (user.role === 'member') {
                    const UserActivity = await NOSQL.UserActivity.findOne({ user_ip, uid: user.uid , user_agent });

                    if (!UserActivity) {
                        await NOSQL.UserActivity.create({
                            user_agent, data: JSON.stringify(os()), action: 'login', topic: "session", result: 'succeed', user_ip, token: txhash, uid: user.uid
                        });
                        await EmailSend.sendVerificationEmail({
                            to: user.email,
                            subject: 'Email Verification',
                            link: `${process.env.BASE_URL || undefined}/email/verified/${txhash}/${user.uid}`
                        });

                        return rep.status(403).json({
                            "api-version": "1.0",
                            statusCode: 403,
                            message: { error: `identity.session.ipdetect` }
                        });
                    }

                    if (UserActivity.result === 'pending') {
                        return rep.status(403).json({
                            "api-version": "1.0",
                            statusCode: 403,
                            message: { error: `identity.session.ipdetect` }
                        });
                    }
                    const data = {
                        email: user.email, uid: user.uid, avater: user.avater, role: user.role, level: user.level, referral_uid: user.referral_uid,
                        data: user.data, two_factor_auth: user.two_factor_auth, status: user.status, created_at: user.created_at, updated_at: user.updated_at
                    };

                    const token = jwt.sign({ user: data }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
                    const result = { ...data, phones: {}, profiles: {}, csrf_token: token };
                    return sendJSONResponse({ res: rep, message: { success: 'e' }, result: { user: result } })
                }
                return rep.status(403).json({
                    "api-version": "1.0",
                    statusCode: 403,
                    message: { error: 'page.header.admin.permissions.error' }
                });
            }
            return rep.status(403).json({
                "api-version": "1.0",
                statusCode: 403,
                message: { error: `identity.session.${user.status}` }
            });
        }
        // Handle further two-factor authentication logic...

    } catch (error) {
        next(error);
    }
});



sessionsRouter.get('/email/verify', async (req, res, next) => {
    try {
        const { token } = req.query;

        // Check if the token is provided
        if (!token) {
            return sendJSONResponse({ res, statusCode: 400, message: { error: 'No verification token provided.' } });
        }

        const verification = await NOSQL.Verification.findOne({ token });

        if (!verification) {
            return sendJSONResponse({ res, statusCode: 400, message: { error: 'Invalid verification token.' } });
        }

        const now = new Date();
        const tokenCreationTime = verification.createdAt;
        const tokenExpiryTime = 45000 * 60 * 1000; // 405 minutes in milliseconds

        const isValid = now.getTime() - tokenCreationTime.getTime() <= tokenExpiryTime;

        if (!isValid) {
            return sendJSONResponse({ res, statusCode: 400, message: { error: 'Verification token has expired.' } });
        }

        const user = await NOSQL.UserModel.findOne({
            uid: verification.userId,
            status: { $in: ['inactive', 'pending'] }
        });

        if (!user) {
            return sendJSONResponse({ res, statusCode: 400, message: { error: 'User not found or already verified.' } });
        }

        // Update user status if necessary and handle verification logic here
        // Example: user.status = 'active'; await user.save();

        //user.status = 'active';
        //await user.save();



        return sendJSONResponse({ res, message: { success: 'Email verification successful!' } });

    } catch (error) {
        next(error);
    }
});

interface JwtPayload {
    [key: string]: any;
}

sessionsRouter.post('/verify', async (req, res) => {
    try {
        const authHeader: any = req.headers['x-csrf-token'];
        if (!authHeader) {
            return res.status(400).json({ "api-version": "2.0", statusCode: 400, message: { error: 'CSRF token is missing' } });
        }

        const data: JwtPayload = jwt.verify(authHeader, process.env.JWT_SECRET || 'default-secret') as { [key: string]: any };

        const result = { user: data.user, phones: {}, profiles: {} };

        return res.json({ "api-version": "2.0", statusCode: 200, message: { success: 'page.header.signUp.message.success' }, result });
    } catch (error : any) {
        if(error.message === 'jwt expired'){
            return res.json({ "api-version": "2.0", statusCode: 200, message: { error: 'page.header.signUp.message.error' }  });
        }
        return res.status(500).json({ "api-version": "2.0", statusCode: 500, message: { error: 'An error occurred during verification' } });
    }
});



sessionsRouter.get('/valid', async (req, res) => {
    const user_agent = req.headers['user-agent'] || '';
    const ip = req.ip as string;
    const ipv4Regex = /(?:\d{1,3}\.){3}\d{1,3}/;
    const match = ip.match(ipv4Regex);

    const ua = new UAParser(user_agent);

    const user_ip = match?.[0] || ip;

    const getOSNote = ({ data, state }: { data?: any, state?: string } = {}) => {
        if (data) {
            return { ...data };
        }

        const osName = ua.getOS().name;
        let device = '';

        if (osName === 'Windows') {
            device = 'PC';
        } else if (osName === 'Android') {
            device = 'Android';
        } else if (osName === 'Mac OS') {
            device = 'MacBook';
        } else if (osName === 'iOS') {
            device = 'iPhone';
        }

        return device ? { note: `Login ${state || 'pending'} on ${device}` } : {};
    };

    const UserActivity = await NOSQL.UserActivity.findOne({ user_ip, user_agent });

    console.log(UserActivity);

    res.json({ ip: user_ip });
});

sessionsRouter.get('/activities', async (req, res) =>{
    const result = await NOSQL.UserActivity.find({ }).limit(100);
    sendJSONResponse({ res , message : { success : 's'} , result })
})
 