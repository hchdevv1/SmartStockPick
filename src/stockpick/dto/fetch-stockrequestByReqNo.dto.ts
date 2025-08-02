
import {   IsString ,IsOptional} from 'class-validator';


export class FetchStockRequestDto{
    
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
  }