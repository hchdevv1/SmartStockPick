export interface ifaceStockRequestItem {
  INRQRowId?: string;
  INRQNo?: string;
  RequestingLocationCode?: string;
  RequestingLocationDesc?: string;
  SupplyingLocationCode?: string;
  SupplyingLocationDesc?: string;
  INRQDate?:string;
  PickStatusID?:string;
  PickStatus?:string;
  PickCompleted?:boolean;
}

export interface ifaceStockRequestResponse {
  StockRequestInfo: ifaceStockRequestItem[];
}
