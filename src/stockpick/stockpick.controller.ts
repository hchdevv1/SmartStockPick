import { Controller, Get, Param ,Post,Body} from '@nestjs/common';
import { StockpickService } from './stockpick.service';
import { FetchStockRequestDto } from './dto/fetch-stockrequest.dto';
import { MatchBarcodeToStockRequestItemDto} from './dto/fetch-matchbarcode-requestItem.dto';
@Controller('stockpick')
export class StockpickController {
  constructor(private readonly stockpickService: StockpickService,
  //  private readonly mssqlService: MssqlService
  ) { }


@Post('stock-requests')
FetchStockRequest(@Body() fetchStockRequestDto: FetchStockRequestDto) {
  if (fetchStockRequestDto.xRequestNumber!){
    return this.stockpickService.getStockRequestListByRequestNumber(fetchStockRequestDto);
  }else{ 
    return this.stockpickService.getStockRequestList(fetchStockRequestDto);
  }
}
@Get('stock-requests/:xINRQRowId')
FetchStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
    return this.stockpickService.getStockRequestByReqNo(xINRQRowId);
}
@Post('stock-requests/match-barcode')
matchBarcodeToStockRequestItem(@Body() matchBarcodeToStockRequestItemDto: MatchBarcodeToStockRequestItemDto) {
 
    {
    return this.stockpickService.matchBarcodeToStockRequestItem(matchBarcodeToStockRequestItemDto);
  }
}


/*

  @Get('/isBarcodeItemMatched2/:xBarcode13Digi')
  isBarcodeItemMatched2(@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return 'this.stockpickService.isBarcodeItemMatched2(xBarcode13Digi)'+xBarcode13Digi;
  }

 @Get('/StockRequestByReqNo/:xINRQRowId')
  getStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
    return this.stockpickService.getStockRequestByReqNo(xINRQRowId);
  }

 @Get('/isBarcodeItemMatched/:xINRQRowId/:xBarcode13Digi')
  isBarcodeItemMatched(@Param('xINRQRowId') xINRQRowId: string ,@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return this.stockpickService.isBarcodeItemMatched(xINRQRowId,xBarcode13Digi);
  }
  */
}
