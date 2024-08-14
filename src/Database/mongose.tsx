import { UserPermissionAction, UserPermissionVerb } from 'constanst/permissions';
import   { Schema } from 'mongoose';
import { UserRole } from './types';


export const PermissionSchema: Schema = new Schema({
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
    url : String,
    role : { type : String ,   enum: Object.values(UserRole) }
  });
  

  export const  Modal = {  PermissionSchema }