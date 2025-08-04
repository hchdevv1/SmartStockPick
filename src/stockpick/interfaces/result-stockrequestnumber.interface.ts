export interface ifaceResultStockRequestNumberInfo {
  StockRequestNumberStatus?: StockRequestNumberStatus;
  StockRequestByReqNoInfo?: StockRequestByReqNoDto[];
}

export interface StockRequestNumberStatus {
  statusCode?: number;
  statusDesc?: string;
}

export interface StockRequestByReqNoDto {
  INRQRowId?: string;
  INRQIRowId?: string;
  INRQNo?: string;
  RequestingLocationCode?: string;
  RequestingLocationDesc?: string;
  SupplyingLocationCode?: string;
  SupplyingLocationDesc?: string;
  INRQDate?: string;
  INRQTime?: string;
  ItemCode?: string;
  ItemDesc?: string;
  UOM?: string;
  ReqQty?: string;
  BarCodeStock?: string;
  PickByCode?: string;
  PickByName?: string;
  PickStatusId?: number;
  PickStatus?: string;
  isMedicine?: string;
  BINNo?: string;
}
