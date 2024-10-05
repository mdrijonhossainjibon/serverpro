import { API_CALL, TypeApiPromise } from 'api_Call';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
 
 

export enum RestrictionState {
  Enabled = "enabled",
  Disabled = "disabled",
}

export enum RestrictionScope {
  All = "all",
  Continent = "continent",
  Country = "country",
  Ip = "ip",
  IpSubnet = "ip_subnet",
}

export enum RestrictionCategory {
  Whitelist = "whitelist",
  Maintenance = "maintenance",
  Blacklist = "blacklist",
}


interface RestrictionData {
  [scope: string]: {
    [category: string]: string[];
  };
}
// Example in-memory restriction data
const restrictionData : RestrictionData = {
  [RestrictionScope.All]: {
    [RestrictionCategory.Whitelist]: ['192.168.0.1'],
    [RestrictionCategory.Blacklist]: ['10.0.0.1'],
  },
  [RestrictionScope.Country]: {
    [RestrictionCategory.Blacklist]: ['BD'],
  },
  // Add more scope and category mappings as needed
};

interface ErrorResponse {
  error: string;
  message?: string; // Optional detailed message
}


 

const checkRestriction = (scope: RestrictionScope, category: RestrictionCategory, value: string): boolean => {
  // Fetch the restrictions for the given scope and category
  const restrictions = restrictionData[scope]?.[category] || [];
 console.log(restrictionData[scope][category])
  // Check if the value is in the list of restricted values
  return !restrictions.includes(value);
};


export const restrictionMiddleware = (scope: RestrictionScope, category: RestrictionCategory, value: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (checkRestriction(scope, category, value)) {
      next();
    } else {
      const errorResponse: ErrorResponse = {
        error: "Access forbidden due to restriction",
        message: `You are restricted from accessing this resource based on your ${scope} and ${category}.`
      };
      res.status(403).json(errorResponse);
    }
  };
};

 



//const checkRestriction1 = async (  scope: RestrictionScope, category: RestrictionCategory,  value: string ) : Promise<{ isAllowed  : boolean ;  code : string | null }>  => {
  
   
    //const { response , status} : TypeApiPromise= await API_CALL(  { baseURL : 'http://ip-api.com/json'});

    
       
//};



 



