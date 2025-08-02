import { Controller, Get, Param ,Post,Body} from '@nestjs/common';
import { StockpickService } from './stockpick.service';
//import { MssqlService } from '../mssql/mssql.service';
import { FetchStockRequestDto } from './dto/fetch-stockrequest.dto';

@Controller('stockpick')
export class StockpickController {
  constructor(private readonly stockpickService: StockpickService,
  //  private readonly mssqlService: MssqlService
  ) { }


@Post('stock-request-list')
FetchStockRequest(@Body() fetchStockRequestDto: FetchStockRequestDto) {
  if (fetchStockRequestDto.xRequestNumber!){
    return this.stockpickService.getStockRequestListByRequestNumber(fetchStockRequestDto);
  }else{
    
    return this.stockpickService.getStockRequestList(fetchStockRequestDto);
  }
}

@Get('stock-request-requestnumber/:xINRQRowId')
FetchStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
    return 'this.stockpickService.getStockRequestRequestnumber(xINRQRowId)'+xINRQRowId;
}


 @Get('/StockRequestByReqNo/:xINRQRowId')
  getStockRequestByReqNo2(@Param('xINRQRowId') xINRQRowId: string) {
    return this.stockpickService.getStockRequestByReqNo(xINRQRowId);
  }




  @Get('/isBarcodeItemMatched2/:xBarcode13Digi')
  isBarcodeItemMatched2(@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return 'this.stockpickService.isBarcodeItemMatched2(xBarcode13Digi)'+xBarcode13Digi;
  }

 // @Get('/StockRequestList/:xDateFrom/:xDateTo/:xLocationCode/:xFlagStatus')
  /*@Get('/StockRequestList/:xDateFrom/:xDateTo/:xLocationCode')
  getStockRequestList(@Param('xDateFrom') xDateFrom: string, @Param('xDateTo') xDateTo: string, @Param('xLocationCode') xLocationCode: string) {
    return 'this.stockpickService.getStockRequestList(xDateFrom, xDateTo, xLocationCode)';
  }*/

 @Get('/StockRequestByReqNo/:xINRQRowId')
  getStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
    return this.stockpickService.getStockRequestByReqNo(xINRQRowId);
  }
 @Get('/isBarcodeItemMatched/:xINRQRowId/:xBarcode13Digi')
  isBarcodeItemMatched(@Param('xINRQRowId') xINRQRowId: string ,@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return this.stockpickService.isBarcodeItemMatched(xINRQRowId,xBarcode13Digi);
  }
}
