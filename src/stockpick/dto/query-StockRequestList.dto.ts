import { IsInt, IsString, IsOptional, IsBoolean ,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStockRequestBodyDto {
   
      @ValidateNested({ each: true })
  @Type(() => StockRequestListDto)
  @IsOptional()
  StockRequestInfo?: StockRequestListDto[];
}
export class StockRequestListDto {


    @IsInt()
    @IsOptional()
    INRQRowId?: number

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
    

     @IsBoolean()
    @IsOptional()
    UserCompleted?: boolean;

    @IsString()
    @IsOptional()
    PickStatus?:string;

     @IsString()
    @IsOptional()
    PickStatusID?:string;

}