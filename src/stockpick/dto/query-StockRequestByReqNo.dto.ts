import { IsInt, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStockRequestByReqNoBodyDto {

    @ValidateNested({ each: true })
    @Type(() => StockRequestByReqNoDto)
    @IsOptional()
    StockRequestByReqNoInfo?: StockRequestByReqNoDto[];
}
export class StockRequestByReqNoDto {


    @IsInt()
    @IsOptional()
    INRQRowId?: string

    @IsString()
    @IsOptional()
    INRQIRowId?: string;

    @IsString()
    @IsOptional()
    INRQNo?: string;

    @IsString()
    @IsOptional()
    RequestingLocationCode?: string;

    @IsString()
    @IsOptional()
    RequestingLocationDesc?: string;

    @IsString()
    @IsOptional()
    SupplyingLocationCode?: string;

    @IsString()
    @IsOptional()
    SupplyingLocationDesc?: string;


    @IsString()
    @IsOptional()
    INRQDate?: string;

    @IsString()
    @IsOptional()
    INRQTime?: string;

    @IsString()
    @IsOptional()
    ItemCode?: string;

    @IsString()
    @IsOptional()
    ItemDesc?: string;

    @IsString()
    @IsOptional()
    UOM?: string;

    @IsString()
    @IsOptional()
    ReqQty?: string;

    @IsString()
    @IsOptional()
    BarCodeStock?: string;

     @IsString()
    @IsOptional()
    PickByCode?: string;

     @IsString()
    @IsOptional()
    PickByName?: string;
     @IsInt()
    @IsOptional()
    PickStatusId?: number

     @IsString()
    @IsOptional()
    PickStatus?: string;

    @IsString()
    @IsOptional()
    isMedicine?: string;

    @IsString()
    @IsOptional()
    BINNo?: string;

}