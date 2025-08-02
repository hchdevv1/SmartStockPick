
import {   IsString ,IsOptional} from 'class-validator';


export class FetchStockRequestDto{
    
    @IsString()
    @IsOptional()
    xDateFrom?: string;

    @IsString()
    @IsOptional()
    xDateTo?: string;

    @IsString()
    @IsOptional()
    xLocationCode?: string;

    @IsString()
    @IsOptional()
    xRequestNumber?: string;
  }