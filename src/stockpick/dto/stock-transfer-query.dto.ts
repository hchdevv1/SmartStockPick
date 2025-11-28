import { IsOptional, IsString } from 'class-validator';

export class StockTransferQueryDto {
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  locationCode?: string;

  @IsOptional()
  @IsString()
  transferNo?: string;
}
