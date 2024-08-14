import { GeeTestValidateParams, GeeTestValidateResponse } from "./typse";
import crypto from 'crypto-js';


  export const VALIDATE_URL = 'https://gcaptcha4.geetest.com/validate';

///export const GT4_JS = 'https://static.geetest.com/v4/gt4.js';


  export function validateCaptcha(params: GeeTestValidateParams): Promise<GeeTestValidateResponse> {
    const { captcha_id, validator_endpoint_url, ...postPrams } = params;
  
    const url = new URL(validator_endpoint_url || VALIDATE_URL);
    url.searchParams.set('captcha_id', captcha_id);
  
    return new Promise(async (resolve, reject) => {
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(postPrams).toString(),
      });
  
      // When the request geetest service interface is abnormal, it shall be released to avoid blocking normal business.
      if (!res.status.toString().startsWith('2')) {
        return reject(new Error('server reposed with an error status code'));
      }
  
      return resolve(await res.json());
    });
  }


  export function generateSignToken(lotNumber: string, captchaKey: string): string {
    return crypto.HmacSHA256(lotNumber, captchaKey).toString();
  }