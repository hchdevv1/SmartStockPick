export interface ApiUserLogon {
  LogOnCode: string;
  LogOnUserID: string;
  LogOnUserName: string;
  LogOnStatus: string;
  Remark: string;
 
}

export interface ApiUserLogonResponse {
  LogOnInfo: ApiUserLogon;
}

