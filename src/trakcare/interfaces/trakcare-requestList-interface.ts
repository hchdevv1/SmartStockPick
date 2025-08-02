export interface StockRequestList {
  INRQRowId: string;
  INRQNo: string;
  RequestingLocationCode: string;
  RequestingLocationDesc: string;
  SupplyingLocationCode: string;
  SupplyingLocationDesc: string;
  INRQDate: string;
  UserCompleted: string;
}

export interface StockRequestListResponse {
  StockRequestInfo: StockRequestList[];
}