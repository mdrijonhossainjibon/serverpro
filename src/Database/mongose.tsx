import { UserPermissionAction, UserPermissionVerb } from 'constanst/permissions';
import { Schema } from 'mongoose';
import { ActivityResult, ISocialMediaUser, IUserActivity, IVerification, Subscription, User, UserRole } from './types';



const PermissionSchema: Schema = new Schema({
  action: {
    type: String,
    enum: Object.values(UserPermissionAction),
    required: true,

  },
  verb: {
    type: String,
    enum: Object.values(UserPermissionVerb),
    required: true
  },
  url: String,
  role: { type: String, enum: Object.values(UserRole) },
  create_at: { type: Date, default: Date.now() },
});






const LabelSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  scope: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true }
});

const PhoneSchema = new Schema({
  country: { type: String, required: true },
  number: { type: String, required: true },
  validated_at: { type: Date, required: true }
});



const ProfileSchema = new Schema({
  address: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  dob: { type: Date, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  postcode: { type: String, default: null },
  state: { type: String, required: true },
  updated_at: { type: Date, required: true },
  created_at: { type: Date, required: true },
  metadata: { type: String, required: true } // Storing metadata as a JSON string
});

const SerialSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true }
});


const UserSchema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, default: null },
  uid: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: 'member' },
  level: { type: Number, default: 1 },
  two_factor_auth: { type: Boolean, default: false },
  status: { type: String, default: 'pending' },
  referral_uid: { type: String, default: null },
  data: { type: String, default: "{\"language\":\"en\"}" }, // Storing additional data as a JSON string
  avater: { type: String, default: null },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },

});


export const VerificationSchema: Schema = new Schema<IVerification>({
  userId: { type: String },
  token: { type: String, unique: true },
  Otp: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Token expires after 24 hours
});

const UserActivitySchema = new Schema<IUserActivity>({
  user_agent: { type: String, required: true },
  data: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  action: { type: String, required: true },
  uid: String,
  topic: { type: String, required: true },
  result: { type: String, enum: ['succeed', 'failed', 'denied', 'pending'], required: true },
  token: String,
  user_ip: { type: String, required: true },
});


export const subscriptionSchema = new Schema<Subscription>({
  clientId: String,
  streams: [String],
});



const SocialMediaUserSchema: Schema = new Schema<ISocialMediaUser>(
  {
    provider: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'github'],
    },
    providerId: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Modal = { PermissionSchema, UserSchema, SerialSchema, VerificationSchema, UserActivitySchema, subscriptionSchema  , SocialMediaUserSchema}