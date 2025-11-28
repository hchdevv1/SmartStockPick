import {  IsString } from 'class-validator';

export class StockTransferPickQueryDto {

  @IsString()
  TransferNumber?: string;

 
}
