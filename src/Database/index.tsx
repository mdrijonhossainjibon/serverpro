import mongoose from "mongoose";
import {  Modal } from "./mongose";
import { IPermission, IVerification , IUserActivity, Subscription, ISocialMediaUser } from "./types";

 
const Permission = mongoose.model<IPermission>('Permission', Modal.PermissionSchema );
const UserModel = mongoose.model('User', Modal.UserSchema);
const Serial = mongoose.model('Serial', Modal.SerialSchema);
const Verification = mongoose.model<IVerification>('Verification', Modal.VerificationSchema);
const  UserActivity =  mongoose.model<IUserActivity>('UserActivity', Modal.UserActivitySchema);

export const SubscriptionModel = mongoose.model<Subscription>('Subscription', Modal.subscriptionSchema);
const SocialMediaUser = mongoose.model<ISocialMediaUser>('SocialMediaUser', Modal.SocialMediaUserSchema);

export const NOSQL = {  SocialMediaUser,   Permission  , UserModel , Serial , Verification , UserActivity ,  SubscriptionModel }
 