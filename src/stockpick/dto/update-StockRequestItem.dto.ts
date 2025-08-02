import {  IsString, IsOptional } from 'class-validator';


export class UpdateStrockPickTransactionDto {

@IsOptional()
  @IsString()
  barcodestock?: string;

  @IsOptional()
  @IsString()
  pickbycode?: string;

  @IsOptional()
  @IsString()
  pickbyname?: string;

  @IsOptional()
  @IsString()
  pickstatus?: string;

  @IsOptional()
  @IsString()
  pickdate?: string; 

  @IsOptional()
  @IsString()
  picktime?: string; 

}