import { Controller, Get, Query, Param } from '@nestjs/common';
import { TrakcareService } from './trakcare.service';
import { StockTransferByLocationQueryDto , StockTransferAllLocationQueryDto} from './dto/stock-transfer-query.dto';
//import { CreateTrakcareDto } from './dto/create-trakcare.dto';
//import { UpdateTrakcareDto } from './dto/update-trakcare.dto';

@Controller('trakcare')
export class TrakcareController {
  constructor(private readonly trakcareService: TrakcareService) {}



  
 //#region StockTransfer 
@Get('/stock/transfer/all-locations')
  getStockTransferAllLocation(@Query() query: StockTransferAllLocationQueryDto){
   // http://localhost:3002/trakcare/stock/transfer/all-locations?dateFrom=2024-01-17&dateTo=2024-01-17
     return this.trakcareService.getStockTransferListAllLocation(query);
  }
@Get('/stock/transfer/by-locations')
  getStockTransferByLocation(@Query() query: StockTransferByLocationQueryDto){
   // http://localhost:3002/trakcare/stock/transfer/by-locations?dateFrom=2024-01-17&dateTo=2024-01-17&locationCode=4136
     return this.trakcareService.getStockTransferListByLocation(query);
  }
@Get('/stock/transfer/transfer-no/:transferNo')
   getStockTransferByTransferNo(@Param('transferNo') transferNo: string){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.trakcareService.getStockTransferByTransferNo(transferNo);
  }
@Get('/stock/transfer/order/:transferNo')
   getStockTransferOrder(@Param('transferNo') transferNo: string){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.trakcareService.getStockTransferOrder(transferNo);
  }
  @Get('/stock/location')
   getLocation(){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.trakcareService.getLocation();
  }
   @Get('/stock/stock-location')
   getStockLocation(){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.trakcareService.getStockLocation();
  }
//#endregion
//#region StockRequest 
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
//#endregion


  @Get('/LogonByTrakcare/:xUID/:xPWD')
  getLogonByTrakcare(@Param('xUID') xUID: string,@Param('xPWD') xPWD: string) {
   // http://localhost:3002/trakcare/LogonByTrakcare/6110189/9999
     return this.trakcareService.getLogonByTrakcare(xUID,xPWD);
  }
  

}
