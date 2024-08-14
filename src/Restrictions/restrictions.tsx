// restrictions.ts

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
  