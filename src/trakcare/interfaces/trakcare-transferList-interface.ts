export interface StockTransferList {
  Index:number;
  INITRowId: string;
  INITNo: string;
  INRQRowId: string;
  INRQNo: string;
  RequestingLocationCode: string;
  RequestingLocationDesc: string;
  SupplyingLocationCode: string;
  SupplyingLocationDesc: string;
  INITDate: string;
  TransferComplete: string;
}

export interface StockTransferListResponse {
  StockTransferInfo: StockTransferList[];
}

export interface StockTransferOrder {
  Index:number;
  INITRowId: string;
  TransferNumber: string;
  INRQRowId: string;
  RequestNumber: string;
  INITIRowId: string;
  INITIINCLBDR: string;
  StockItemId: string;
  StockItemCode: string;
  StockItemDesc: string;
  UOM: string;
  BatchQty: string;
  TransferQty: string;
  RequestQty: string;
  Batch: string;
  BatchExpiryDate: string;
  TransferComplete: string;
}

export interface StockTransferOrderResponse {
  StockTransferOrderInfo: StockTransferOrder[];
}