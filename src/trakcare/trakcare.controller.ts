import { Controller, Get, Param } from '@nestjs/common';
import { TrakcareService } from './trakcare.service';
//import { CreateTrakcareDto } from './dto/create-trakcare.dto';
//import { UpdateTrakcareDto } from './dto/update-trakcare.dto';

@Controller('trakcare')
export class TrakcareController {
  constructor(private readonly trakcareService: TrakcareService) {}

@Get('/StockRequestList/:xDateFrom/:xDateTo/:xLocationCode')
  getStockRequestList(@Param('xDateFrom') xDateFrom: string,@Param('xDateTo') xDateTo: string,@Param('xLocationCode') xLocationCode: string){

    // 10.10.17.94:52773/api/SmartStockPick/StockRequestList/2025-04-30/2026-04-30/3011
     return this.trakcareService.getStockRequestList(xDateFrom,xDateTo,xLocationCode);
  }

  @Get('/StockRequestListByRequestNumber/:xRequestNumber')
  getStockRequestListByRequestNumber(@Param('xRequestNumber') xRequestNumber: string){
     return this.trakcareService.getStockRequestListByRequestNumber(xRequestNumber);
  }

@Get('/StockRequestByReqNo/:xINRQRowId')
  getStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
     return this.trakcareService.getStockRequestByReqNo(xINRQRowId);
  }

@Get('/FindStockItemByRequestNo/:xINRQRowId/:xItemCode')
  findStockItemByRequestNo(@Param('xINRQRowId') xINRQRowId: string,@Param('xItemCode') xItemCode: string) {
     return this.trakcareService.findStockItemByRequestNo(xINRQRowId,xItemCode);
  }

  @Get('/LocationList')
  LocationList() {
     return this.trakcareService.findLocationList();
  }
  
  @Get('/LogonByTrakcare/:xUID/:xPWD')
  getLogonByTrakcare(@Param('xUID') xUID: string,@Param('xPWD') xPWD: string) {
     return this.trakcareService.getLogonByTrakcare(xUID,xPWD);
  }
  

}
