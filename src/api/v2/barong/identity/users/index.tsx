import { API_CALL, TypeApiPromise } from "api_Call";
import { NOSQL } from "Database";
import { Router } from "express";
import bcrypt from 'bcrypt';
export const usersRouter = Router();
import crypto from 'crypto';
import { sendJSONResponse } from "responseHandler";
import axios from "axios";
import nodemailer from 'nodemailer';
import { EMAIL_REGEX, PASSWORD_REGEX } from "../sessions";
import path from "path";
import fs from "fs";

async function generateUID() {
    // Find or create the serial counter
    const serialCounter = await NOSQL.Serial.findOneAndUpdate(
        { name: 'user_uid' }, // Name of the serial counter
        { $inc: { value: 1 } }, // Increment the serial number
        { new: true, upsert: true } // Return the updated document, or create it if it doesn't exist
    );

    const prefix = 'ID';
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const serialPart = serialCounter.value.toString().padStart(3, '0'); // Ensure it's a 3-digit number

    return `${prefix}${randomPart}${serialPart}`;
}


usersRouter.post('/', (async (req, res, next) => {

    try {
        const { email, password, refid, data, hash } = req.body;
        const ip = req.ip === '::ffff:127.0.0.1' ?  'localhost' : req.ip
        //Google  Login
        if (hash) {
            const { response, status }: TypeApiPromise = await API_CALL({ baseURL: 'https://www.googleapis.com/oauth2/v3/userinfo', method: 'post', headers: { Authorization: hash } });

            if (response && status === 200) {
                // Check if the user already exists
                const existingUser = await NOSQL.UserModel.findOne({ email: response.email });
                if (existingUser) {
                    return res.status(400).send({ message: { error: 'email.taken' } });
                }
                // Check if refid is valid if provided
                if (refid) {
                    const referrer = await NOSQL.UserModel.findOne({ uid: refid });
                    if (!referrer) {

                        return next({ statusCode: 400, message: 'identity.user.referral_doesnt_exist' })

                    }
                }
                const uid: string = await generateUID()

                await NOSQL.UserModel.create({ email: response.email, uid });

                const verificationToken = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');

                const verificationLink = `http://${ip}:5000/verify?token=${verificationToken}`;

                const Verification = await NOSQL.Verification.findOne({ userId: uid });

                if (Verification) {
                    Verification.token = verificationToken;
                    await Verification.save();
                }

                await NOSQL.Verification.create({ userId: uid, token: verificationToken });
                sendJSONResponse({ res, message: { success: 'User registered successfully' }, result: verificationLink })

            }

        }



        // Check if the request body is empty
        if (!email) {
            return res.status(400).json({ "api-version": "1.0", statusCode: 400, message: { error: 'identity.login.email_empty' } });
        }

        if (!password) {
            return res.status(400).json({ "api-version": "1.0", statusCode: 400, message: { error: 'identity.login.password_empty' } });
        }


        if (email && !email.match(EMAIL_REGEX)) {
            return res.status(400).send({ message: { error: 'page.body.profile.content.action.login' } });
        }
        if (password && !password.match(PASSWORD_REGEX)) {
            return res.status(400).send({ message: { error: 'page.header.signUp.password.message.error' } });
        }

        const existingUser = await NOSQL.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: { error: 'email.taken' } });
        }

        if (refid) {
            const referrer = await NOSQL.UserModel.findOne({ uid: refid });
            if (!referrer) {

                return next({ statusCode: 400, message: 'identity.user.referral_doesnt_exist' })

            }
        }

        const uid: string = await generateUID()
        const ConvertTohash = await bcrypt.hash(password , 12)
        await NOSQL.UserModel.create({ email: email, uid , password : ConvertTohash  });

        const verificationToken = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');
        
        const verificationLink = `http://${ip}:5000/verify?token=${verificationToken}`;

        const Verification = await NOSQL.Verification.findOne({ userId: uid });

        if (Verification) {
            Verification.token = verificationToken;
            await Verification.save();
        }

        await NOSQL.Verification.create({ userId: uid, token: verificationToken });

        const transporter = nodemailer.createTransport({
            host: "smtp.mailersend.net",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "MS_O7JJXl@trial-zr6ke4no123lon12.mlsender.net",
              pass: "TNn8SnhdaO0BdWeH",
            },
          });
    
          const templatePath = path.join(__dirname, 'emailTemplate.html');
          
           let html = fs.readFileSync(templatePath, 'utf8');
    
           const body = {
            from: 'MS_O7JJXl@trial-zr6ke4no123lon12.mlsender.net',
            to: 'daniscarlet@rowdydow.com',
            subject: 'Email Verification',
            html : VerificationEmail(verificationLink),
            text: `Please verify your email by clicking the following link:  `, // Fallback text content
        };
     
           
        transporter.sendMail(body)
         
        sendJSONResponse({ res, message: { success: 'User registered successfully' } })
 
    } catch (error) {
        next(error)
    }

}))





//1534161a980a803fcce1457f41fad164

//b9d611c2a026725fda7d7c9e8fece968


 








const VerificationEmail = (link : string) =>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to [Your Crypto Exchange]</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 20px;
        }
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="[Logo URL]" alt="[Your Crypto Exchange Logo]">
            <h1>Welcome to [Your Crypto Exchange]!</h1>
        </div>
        <div class="content">
            <p>Hi [User Name],</p>
            <p>Thank you for joining [Your Crypto Exchange]! We’re thrilled to have you as a new member.</p>
            <p>Here’s a quick overview of what you can do:</p>
            <ul>
                <li><strong>Trade Cryptocurrencies:</strong> Start buying and selling various cryptocurrencies with ease.</li>
                <li><strong>Access Market Insights:</strong> Get real-time market data and in-depth analytics.</li>
                <li><strong>Secure Your Assets:</strong> Utilize our advanced security features to safeguard your investments.</li>
            </ul>
            <p>We noticed a new login from a device you haven’t used before. If this was you, no action is needed. If you did not log in from this device, please contact our support team immediately:</p>
            <p><strong>Device Details:</strong></p>
            <ul>
                <li><strong>Device:</strong> [Device Name]</li>
                <li><strong>Location:</strong> [Device Location]</li>
                <li><strong>Date:</strong> [Login Date]</li>
            </ul>
            <p>To ensure your account's security, please verify your email by clicking the button below:</p>
            <a href="${link}" class="button">Verify Email</a>
            <p>For any questions or if you need assistance, reach out to our support team at <a href="mailto:support@[your-domain].com">support@[your-domain].com</a>.</p>
            <p>Welcome again, and happy trading!</p>
            <p>Best regards,<br>The [Your Crypto Exchange] Team</p>
        </div>
        <div class="footer">
            <p>&copy; [Year] [Your Crypto Exchange]. All rights reserved.</p>
            <p><a href="[Privacy Policy URL]">Privacy Policy</a> | <a href="[Terms of Service URL]">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>
`
}