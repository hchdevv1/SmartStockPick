
import {   IsString ,IsOptional} from 'class-validator';


export class MatchBarcodeToStockRequestItemDto{
    
    @IsString()
    @IsOptional()
    xINRQRowId?: string;

    @IsString()
    @IsOptional()
    xPickbyCode?: string;

    @IsString()
    @IsOptional()
    xPickbyName?: string;

    @IsString()
    @IsOptional()
    xRequestNumber?: string;
    
    @IsString()
    @IsOptional()
    xBarcodeText?: string;
  }