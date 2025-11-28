export interface StockTransferPickItem {
  Index: number;
  INITRowId: string;
  TransferNumber: string;
  INRQRowId: string;
  RequestNumber: string;
  INITIRowId: string;
  INITIINCLBDR: string;
  StockItemId: string;
  StockItemCode: string;
  StockItemDesc: string;
  BIN: string;
  UOM: string;
  BatchQty: string;
  TransferQty: string;
  RequestQty: string;
  Batch: string;
  BatchExpiryDate: string;
  TransferComplete: string;
  IsMedicine: string;
}

export interface ApiStockTransferPickResponse {
  StockTransferInfo: StockTransferPickItem[];
}
