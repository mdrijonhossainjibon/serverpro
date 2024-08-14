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


const getCountryCodeFromIp = async (ip: string): Promise<string | null> => {
  try {
     const response = await axios.get(`http://ip-api.com/json/?fields=status,message,countryCode`);
    
     return response.data.countryCode; // Adjust based on the actual response
  } catch (error) {
     
    return null;
  }
};




const checkRestriction1 = async (  scope: RestrictionScope,
  category: RestrictionCategory,
  value: string,
  ip: string
): Promise<boolean> => {
  if (scope === RestrictionScope.Country && category === RestrictionCategory.Blacklist) {
    const countryCode = await getCountryCodeFromIp(ip);
    if (countryCode && restrictionData[scope]?.[category]?.includes(countryCode)) {
      return false; // Restricted
    }
  }
  return true; // Not restricted
};




export const restrictionMiddleware1 = (   scope: RestrictionScope,  category: RestrictionCategory ) => {

  
    

  return async (req: Request, res: Response, next: NextFunction) => {

    const response = await axios.get('https://api.ipify.org/?format=json');

    const clientIp =  response.data.ip;
    const isAllowed = await checkRestriction1(scope, category, 'value', clientIp as string);

    if (isAllowed) {
      next();
    } else {
      res.status(451).json({
        "code": -10008,
        "status": "error",
        "message": "Access from your country is blocked.",
        "description": "This service is not available in your country due to geographical restrictions or legal reasons. Please check if you can access the service from a different location or contact support for more information.",
        "details": {
          "countryCode": "CN",
          "reason": "Service restrictions based on local regulations."
        }
      }
      );
    }
  };
};



