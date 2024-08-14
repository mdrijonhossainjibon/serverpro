import { UserPermissionAction, UserPermissionVerb } from "constanst/permissions";
import { Document } from "mongoose";

export interface IPermission extends Document {
    action: UserPermissionAction;
    verb: UserPermissionVerb;
    url : string;
    role : UserRole;
  }


  export enum UserRole {
    USER = "users",
    ADMIN = "admin",
  }
  