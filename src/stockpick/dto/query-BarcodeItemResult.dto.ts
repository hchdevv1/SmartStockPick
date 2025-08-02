import {  IsString, IsOptional } from 'class-validator';

export class QueryBarcodeItemResultBodyDto {
    BarcodeItemResultInfo?: BarcodeItemResultDto
}
class BarcodeItemResultDto {


    @IsString()
    @IsOptional()
    BarcodeText?: string;

    @IsString()
    @IsOptional()
    ItemNo2?: string;


}