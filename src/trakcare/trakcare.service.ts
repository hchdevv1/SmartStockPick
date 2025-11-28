
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

import { firstValueFrom } from 'rxjs';
import { StockTransferListResponse ,StockTransferOrderResponse} from './interfaces/trakcare-transferList-interface';
import { StockRequestListResponse } from './interfaces/trakcare-requestList-interface';
import { StockRequestByReqNoResponse} from './interfaces/trakcare-requestByReqNo-interface';
import { FindStockItemResponse } from './interfaces/trakcare-findstockItemByReqNo-interface';
import { LocationListResponse } from './interfaces/trakcare-location-interface';
import { LogOnInfoResponse} from './interfaces/trakcare-logon-interface';

import { StockTransferByLocationQueryDto , StockTransferAllLocationQueryDto} from './dto/stock-transfer-query.dto';

@Injectable()
export class TrakcareService {
  private readonly trakcareApiUrl: string;

  constructor(private readonly httpService: HttpService,
    private readonly configService: ConfigService) {
    this.trakcareApiUrl = this.configService.get<string>('TRAKCARE_APIURL')!;
  }

  async getStockRequestList(xDateFrom: string, xDateTo: string, xLocationCode: string,
  ): Promise<StockRequestListResponse> {
    if (!xLocationCode){xLocationCode ='NULL'}
    const url = `${this.trakcareApiUrl}/StockRequestList/${xDateFrom}/${xDateTo}/${xLocationCode}`;
    try {
      const response: AxiosResponse<StockRequestListResponse> = await firstValueFrom(
        this.httpService.get<StockRequestListResponse>(url)
      );
      console.log(response.data)
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
 //#region StockTransfer 
  async getStockTransferListAllLocation(query: StockTransferAllLocationQueryDto): Promise<StockTransferListResponse> {
  
    const url = `${this.trakcareApiUrl}/StockTransferListAllLocation/${query.dateFrom}/${query.dateTo}`;
    try {
      const response: AxiosResponse<StockTransferListResponse> = await firstValueFrom(
        this.httpService.get<StockTransferListResponse>(url)
      );
      console.log(response.data)
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockTransferList all Location:', error.message);
      } else {
        console.error('Error fetching StockTransferList all Location:', error);
      }
      throw new Error('Unable to fetch StockTransferList all Location from external API');
    }
  }
  async getStockTransferListByLocation(query: StockTransferByLocationQueryDto): Promise<StockTransferListResponse> {
  
    const url = `${this.trakcareApiUrl}/StockTransferListByLocation/${query.dateFrom}/${query.dateTo}/${query.locationCode}`;
    try {
      const response: AxiosResponse<StockTransferListResponse> = await firstValueFrom(
        this.httpService.get<StockTransferListResponse>(url)
      );
      console.log(response.data)
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockTransferList all Location:', error.message);
      } else {
        console.error('Error fetching StockTransferList all Location:', error);
      }
      throw new Error('Unable to fetch StockTransferList all Location from external API');
    }
  }
 async getStockTransferByTransferNo(xTransferNumber: string): Promise<StockTransferListResponse> {
  
    const url = `${this.trakcareApiUrl}/StockTransferListByTransferNumber/${xTransferNumber}`;
    try {
      const response: AxiosResponse<StockTransferListResponse> = await firstValueFrom(
        this.httpService.get<StockTransferListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockTransferList all Location:', error.message);
      } else {
        console.error('Error fetching StockTransferList all Location:', error);
      }
      throw new Error('Unable to fetch StockTransferList all Location from external API');
    }
  }

 async getStockTransferOrder (xTransferNumber: string): Promise<StockTransferOrderResponse> {
  
    const url = `${this.trakcareApiUrl}/StockTransferOrder/${xTransferNumber}`;
    try {
      const response: AxiosResponse<StockTransferOrderResponse> = await firstValueFrom(
        this.httpService.get<StockTransferOrderResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockTransferList all Location:', error.message);
      } else {
        console.error('Error fetching StockTransferList all Location:', error);
      }
      throw new Error('Unable to fetch StockTransferList all Location from external API');
    }
  }
async getLocation(): Promise<LocationListResponse> {
    const url = `${this.trakcareApiUrl}/LocationList/`;
    try {
      const response: AxiosResponse<LocationListResponse> = await firstValueFrom(
        this.httpService.get<LocationListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
async getStockLocation(): Promise<LocationListResponse> {
    const url = `${this.trakcareApiUrl}/StockLocationList/`;
    try {
      const response: AxiosResponse<LocationListResponse> = await firstValueFrom(
        this.httpService.get<LocationListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
//#endregion

async getStockRequestListByRequestNumber(xRequestNumber: string): Promise<StockRequestListResponse> {
    const url = `${this.trakcareApiUrl}/StockRequestListByRequestNumber/${xRequestNumber}`;
        try {
      const response: AxiosResponse<StockRequestListResponse> = await firstValueFrom(
        this.httpService.get<StockRequestListResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
  
  async getStockRequestByReqNo(xINRQRowId: string): Promise<StockRequestByReqNoResponse> {
    const url = `${this.trakcareApiUrl}/StockRequestByReqNo/${xINRQRowId}`;
    try {
      const response: AxiosResponse<StockRequestByReqNoResponse> = await firstValueFrom(
        this.httpService.get<StockRequestByReqNoResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
/*
async getStockRequestByReqNo(xINRQRowId: string) {
    let response: any;
    let StockRequestInfo;
    try {
      const url = `${this.apiUrl}/StockRequestByReqNo/${xINRQRowId}`;

      response = await firstValueFrom(this.httpService.get(url));
      StockRequestInfo = response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

    }
    return StockRequestInfo
  }
*/
 async findStockItemByRequestNo(xINRQRowId: string,xItemCode: string): Promise<FindStockItemResponse> {
    const url = `${this.trakcareApiUrl}/FindStockItemByRequestNo/${xINRQRowId}/${xItemCode}`;
    try {
      const response: AxiosResponse<FindStockItemResponse> = await firstValueFrom(
        this.httpService.get<FindStockItemResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
/*
 async findStockItemByRequestNo(xINRQRowId: string, xItemCode: string) {
    let response: any;
    let ItemInfo;
    try {
      const url = `${this.apiUrl}/FindStockItemByRequestNo/${xINRQRowId}/${xItemCode}`;

      response = await firstValueFrom(this.httpService.get(url));
      ItemInfo = response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

    }
    return ItemInfo
  }
*/
  async getLogonByTrakcare(xUID: string, xPWD: string): Promise<LogOnInfoResponse> {
    const url = `${this.trakcareApiUrl}/LogonByTrakcare/${xUID}/${xPWD}`;
    try {
      const response: AxiosResponse<LogOnInfoResponse> = await firstValueFrom(
        this.httpService.get<LogOnInfoResponse>(url)
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching StockRequestList:', error.message);
      } else {
        console.error('Error fetching StockRequestList:', error);
      }
      throw new Error('Unable to fetch StockRequestList from external API');
    }
  }
  /*
  async getLogonByTrakcare(xUID: string, xPWD: string) {
    let response: any;
    let ItemInfo;
    try {
      const url = `${this.apiUrl}/LogonByTrakcare/${xUID}/${xPWD}`;
      response = await firstValueFrom(this.httpService.get(url));
      ItemInfo = response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

    }
    return ItemInfo
  }
  */
  
/*
  async findLocationList3() {
    let response: any;
    let ItemInfo;
    try {
      const url = `${this.apiUrl}/LocationList/`;
      response = await firstValueFrom(this.httpService.get(url));
      ItemInfo = response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

    }
    return ItemInfo
  }*/
  /*
   async getStockRequestList( xDateFrom: string ,xDateTo: string ,xLocationCode: string ) {
      let response:any ;
      let StockRequestInfo ;
      try{
        const url = `${this.apiUrl}/StockRequestList/${xDateFrom}/${xDateTo}/${xLocationCode}`;
      
         response = await firstValueFrom(this.httpService.get(url));
        StockRequestInfo = response.data
         
      } catch(error)
        {
            if (error instanceof HttpException) {
              throw error;
           }
            
        }
     return StockRequestInfo
    }
    */
 
 
  
}


