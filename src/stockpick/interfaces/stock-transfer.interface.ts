export interface ApiStockTransfer {
  Index: number;
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

export interface ApiStockTransferResponse {
  StockTransferInfo: ApiStockTransfer[];
}
