import {   IsString ,IsOptional} from 'class-validator';

export class BarcodestockMatchedDto {
  @IsString()
  @IsOptional()
  transferNo?: string;
  @IsString()
  @IsOptional()
  barcodestock?: string;
  @IsString()
  @IsOptional()
  pickbycode?: string;
  @IsString()
  @IsOptional()
  pickbyname?: string;
  @IsString()
  @IsOptional()
  pickdate?: string;
  @IsString()
  @IsOptional()
  picktime?: string;
  @IsString()
  @IsOptional()
  pickqty?: string;
}