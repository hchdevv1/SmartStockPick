export interface LocationList {
  RowID: string;
  Code: string;
  Desc: string;
}

export interface LocationListResponse {
  LocationInfo: LocationList[];
}