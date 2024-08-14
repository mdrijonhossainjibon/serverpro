import express, { Request, Response, NextFunction } from 'express';
import { generateSignToken, validateCaptcha } from './contain';

export const CaptchaRouter = express.Router();

const CAPTCHA_ID = '9b5e0a990e8cb12a9eb43556ccf124ba';
const CAPTCHA_KEY = 'a63ee93de9fb47aa0c196ccfee2ce0cf';

// Example route to handle CAPTCHA verification
CaptchaRouter.get('/', (req: Request, rep: Response, next: NextFunction) => {
    try {
        return rep.status(200).json({ result: { gt: CAPTCHA_ID, challenge: CAPTCHA_KEY } });
    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
});

CaptchaRouter.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
   

    try {

        const { captcha_output, gen_time, lot_number, pass_token } = req?.body;

        if (!captcha_output || !gen_time || !lot_number || !pass_token) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        const { status, result } = await validateCaptcha({
            captcha_id: CAPTCHA_ID,
            lot_number,
            captcha_output,
            pass_token,
            gen_time,
            sign_token: generateSignToken(lot_number, CAPTCHA_KEY),
        }); 

        if (status === 'error') {
            return res.status(400).json({ message: { error: 'fail' } });
        }
        return res.status(200).json({ message: { success: result } });
    } catch (error) {
        next(error); // Pass error to the error-handling middleware
    }
});

 