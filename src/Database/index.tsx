import mongoose from "mongoose";
import {  Modal } from "./mongose";
import { IPermission } from "./types";

 
const Permission = mongoose.model<IPermission>('Permission', Modal.PermissionSchema );



export const NOSQL = {    Permission  }