import { UserPermissionAction, UserPermissionVerb } from "constanst/permissions";
import { Document } from "mongoose";

export interface IPermission extends Document {
    action: UserPermissionAction;
    verb: UserPermissionVerb;
    url : string;
    role : UserRole;
    create_at : Date;
  }


  export enum UserRole {
    USER = "member",
    ADMIN = "admin",
    Public = 'public',
    Private = 'private',
    Accountant ='accountant',
    Superadmin = 'superadmin',
    Technical = 'technical'
  }
     


  interface Label {
    key: string;
    value: string;
    scope: string;
    created_at: string;
    updated_at: string;
}

interface Phone {
    country: string;
    number: string;
    validated_at: string;
}

interface Profile {
    address: string | null;
    city: string | null;
    country: string | null;
    dob: string;
    first_name: string;
    last_name: string;
    postcode: string | null;
    state: string;
    updated_at: string;
    created_at: string;
    metadata: string; // JSON string containing additional metadata
}

export interface User extends Document {
    email: string;
    password : string;
    uid: string;
    role:'member' | 'admin' | 'private' | 'public' | 'accountant'  | 'superadmin' |   'support' |'technical' ;
    level: number;
    two_factor_auth : boolean;
    status: 'active' |'inactive' | 'suspend' | 'pending';
    referral_uid: string | null;
    data: string; // JSON string containing additional data
    avater : string;
    created_at: Date;
    updated_at: Date;
}


export interface IVerification extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  Otp : number;
}




export type ActivityResult = 'succeed' | 'failed'  | 'denied'  | 'pending'

// Define the interface for the document
export interface IUserActivity extends Document {
  user_agent: string;
  data: string; // JSON string
  created_at: Date;
  uid : string;
  action: string;
  topic: 'session' | 'security' ;
  result: ActivityResult;
  token : string;
  user_ip: string;
}

export interface Subscription extends Document {
  clientId: String,
  streams: [String],
}


export interface ISocialMediaUser extends Document {
  provider: 'google' | 'facebook' | 'github';
  providerId: string; // ID provided by the social media platform
  email: string; // Email retrieved from social media account
  name: string; // Name retrieved from social media account
  avatar: string; // Avatar URL retrieved from social media account
  createdAt: Date;
  updatedAt: Date;
}