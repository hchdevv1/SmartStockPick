import { IsOptional, IsString } from 'class-validator';

export class StockTransferByLocationQueryDto {
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  locationCode?: string;
}

export class StockTransferAllLocationQueryDto {
  @IsString()
  @IsOptional()
  dateFrom?: string;   

  @IsString()
  @IsOptional()
  dateTo?: string;   
}
