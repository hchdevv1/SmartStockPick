import { IsString, IsOptional } from 'class-validator';

export class BarcodestockUpdateDto {

  @IsString()
  @IsOptional()
  transfernumber?: string;
  
  @IsString()
  @IsOptional()
  stockitemcode?: string;

  @IsString()
  @IsOptional()
  barcodestock?: string;
}
