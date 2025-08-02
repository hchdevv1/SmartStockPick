
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

import { firstValueFrom } from 'rxjs';

import { StockRequestListResponse } from './interfaces/trakcare-requestList-interface';
import { StockRequestByReqNoResponse} from './interfaces/trakcare-requestByReqNo-interface';
import { FindStockItemResponse } from './interfaces/trakcare-findstockItemByReqNo-interface';
import { LocationListResponse } from './interfaces/trakcare-location-interface';
import { LogOnInfoResponse} from './interfaces/trakcare-logon-interface';

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
   async findLocationList(): Promise<LocationListResponse> {
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


