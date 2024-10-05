import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


export interface API_CALL_PROPS {
    method?: Method;
    url?: string;
    baseURL?: string;
    body?: any;
    apiVersion?: '1.0';
    headers?: headers;
    params? : Object
  }


  type headers = {
    contentType?: 'json' | 'image' | 'text' | 'video';
    Authorization : string
  };

  


  export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';


type responstype = {
    message : { error?: any; success?: any; };
    result : any
    email : string;
    email_verified :boolean;
    name : string;
    picture : string;
    error : string;
    error_description : string;
    status : 'success' | 'error';
    query : string;
    country : string;
    countryCode : string;
};
      


export interface TypeApiPromise {
    status?: number;
    response?: responstype;
  }


  export const API_CALL = async (props: API_CALL_PROPS) =>{
    const api = axios.create({
        baseURL: props?.baseURL,
      });

      // Define default headers for different content types
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authHeader = props.headers?.Authorization
    ? { 'Authorization': `Bearer ${props.headers.Authorization}` }
    : props.headers;


  const config: AxiosRequestConfig = {
    ...props,
    data :  props?.body ? props.body : {},
   
    headers: {
      ...defaultHeaders,
      ...authHeader,
      
    },     
  };

  try {
    // If contentType is 'image', use FormData for image upload
    if (props.headers?.contentType === 'image') {
      const formData = new FormData();
      formData.append('image', props.body);
      config.data = formData;
      
    }

    const response: AxiosResponse = await api(config);

    return {
      status: response.status,
      response: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          status: error.response.status,
          response: error.response.data ,
        };
      } else if (error.request) {
        return {
          status: 500,
          response: { message: { error: 'Network error occurred' } },
        };
      } else {
        return {
          status: 500,
          response: { message: { error: 'An error occurred' } },
        };
      }
    } else {
      return {
        status: 500,
        response: { message: { error: 'An error occurred' } },
      };
    }
  }


  }