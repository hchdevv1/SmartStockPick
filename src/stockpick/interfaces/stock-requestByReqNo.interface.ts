export interface ifaceStockRequestByReqNoItem {
  INRQRowId: string;
  INRQIRowId: string;
  INRQNo: string;
  RequestingLocationCode: string;
  RequestingLocationDesc: string;
  SupplyingLocationCode: string;
  SupplyingLocationDesc: string;
  ByUserName: string;
  Status: string;
  INRQDate: string;
  INRQTime: string;
  ItemCode: string;
  ItemDesc: string;
  UOM: string;
  ReqQty: string;
  UserCompleted?: string;
  isMedicine: string;
  BarCodeStock?: string;
  PickByCode?: string;
  PickByName?: string;
  PickStatusId?: number;
  PickStatus?: string;


}

export interface ifaceStockRequestByReqNoResponse {
  StockRequestByReqNoInfo: ifaceStockRequestByReqNoItem[];
}

/*

export interface StockRequestByReqNo {
  INRQRowId: string;
  INRQIRowId: string;
  INRQNo: string;
  RequestingLocationCode: string;
  RequestingLocationDesc: string;
  SupplyingLocationCode: string;
  SupplyingLocationDesc: string;
  ByUserName: string;
  Status: string;
  INRQDate: string;
  INRQTime: string;
  ItemCode: string;
  ItemDesc: string;
  UOM: string;
  ReqQty: string;
  isMedicine: string;
}

export interface StockRequestByReqNoResponse {
  StockRequestByReqNoInfo: StockRequestByReqNo[];
}
*/