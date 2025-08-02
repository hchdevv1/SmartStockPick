export interface LogOnInfo {
  LogOnCode: string;
  LogOnUserID: string;
  LogOnStatus: string;
}

export interface LogOnInfoResponse {
  LogOnInfo: LogOnInfo[];
}