export interface FindStockItem {
  INRQRowId: string;
  INRQIRowId: string;
  INRQNo: string;
  ItemCode: string;
  ItemDesc: string;
}

export interface FindStockItemResponse {
  FindStockItemInfo: FindStockItem[];
}