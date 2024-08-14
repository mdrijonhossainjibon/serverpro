
export type GeeTestValidateResult = {
    captcha_id: string;
    captcha_output: string;
    gen_time: string;
    lot_number: string;
    pass_token: string;
  };


export type GeeTestValidateParams = GeeTestValidateResult & {
    sign_token: string;
    validator_endpoint_url?: string;
  };


  export type GeeTestValidateResponse = { status: 'success' | 'error' } & {
    result: 'success' | 'fail';
    reason: string;
    captcha_args: {
      [key: string]: string;
      used_type: string;
      user_ip: string;
      lot_number: string;
      scene: string;
      referer: string;
    };
  } & {
    code: string;
    msg: string;
    desc: object;
  };
