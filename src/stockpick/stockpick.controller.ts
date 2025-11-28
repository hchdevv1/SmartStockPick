import { Controller, Get, Param ,Post,Body ,Query} from '@nestjs/common';
import { StockpickService } from './stockpick.service';
import { FetchStockRequestDto } from './dto/fetch-stockrequest.dto';
import { MatchBarcodeToStockRequestItemDto} from './dto/fetch-matchbarcode-requestItem.dto';
import { StockTransferQueryDto } from './dto/stock-transfer-query.dto';
import { BarcodestockMatchedDto } from './dto/barcodestock-matched.dto';
import { BarcodestockUpdateDto } from './dto/barcodestock-update.dto';
import { UserLogonQueryDto} from './dto/user-logon.dto'
@Controller('stockpick')
export class StockpickController {
  constructor(private readonly stockpickService: StockpickService,
  //  private readonly mssqlService: MssqlService
  ) { }



@Get('sync-stock')
  async getStockTransfers(@Query() query: StockTransferQueryDto) {
    return this.stockpickService.processStockTransfers(query);
  }
@Get('stock-transfer/pick/:xTransferNumber')
   stocktransferpick(@Param('xTransferNumber') xTransferNumber: string) {
    return this.stockpickService.processStockTransferPick(xTransferNumber);
  }

  @Get('stock-transfer/no-barcode/:transferNumber')
   getNoBarcode(@Param('xTransferNumber') xTransferNumber: string) {
    return this.stockpickService.getMissingBarcodeByTransferNumber(xTransferNumber);
  }

@Post('stock-transfer/barcodestock-matched')
   barcodestockMatched(@Body('BarcodestockMatched') body: BarcodestockMatchedDto) {
    return this.stockpickService.processBarcodeMatched(body);
  }
@Post('stock-transfer/barcodestock-update')
   barcodestockupdate(@Body('BarcodestockUpdate') body: BarcodestockUpdateDto) {
    return  this.stockpickService.updateBarcodestock(body);
  }

  @Get('all-location')
   getLocation(){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.stockpickService.getLocation();
  }
   @Get('stock-location')
   getStockLocation(){
   // http://localhost:3002/trakcare/stock/transfer/transfer-no/TF67-001433
     return this.stockpickService.getStockLocation();
  }
@Get('userlogon')
  async getUserLogon(@Query() query: UserLogonQueryDto) {
    return this.stockpickService.getUserLogon(query);
  }




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

 @Get('/StockRequestByReqNo/:xINRQRowId')
  getStockRequestByReqNo(@Param('xINRQRowId') xINRQRowId: string) {
    return this.stockpickService.getStockRequestByReqNo(xINRQRowId);
  }

/*

  @Get('/isBarcodeItemMatched2/:xBarcode13Digi')
  isBarcodeItemMatched2(@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return 'this.stockpickService.isBarcodeItemMatched2(xBarcode13Digi)'+xBarcode13Digi;
  }



 @Get('/isBarcodeItemMatched/:xINRQRowId/:xBarcode13Digi')
  isBarcodeItemMatched(@Param('xINRQRowId') xINRQRowId: string ,@Param('xBarcode13Digi') xBarcode13Digi: string) {
    return this.stockpickService.isBarcodeItemMatched(xINRQRowId,xBarcode13Digi);
  }
  */
}
