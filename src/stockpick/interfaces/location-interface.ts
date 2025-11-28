export interface LocationList {
  RowID: string;
  LocationCode: string;
  LocationDesc: string;
}

export interface LocationListResponse {
  LocationInfo: LocationList[];
}