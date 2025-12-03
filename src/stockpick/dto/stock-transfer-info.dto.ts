export interface StockTransferInfoDto {
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
  pickstatusid?: string;
  pickstatus?: string;
}

export interface StockTransferInfoResponse {
  StockTransferInfo: StockTransferInfoDto[];
}
