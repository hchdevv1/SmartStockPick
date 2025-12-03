import {   IsString ,IsOptional} from 'class-validator';

export class PickStatusQueryDto {
  @IsString()
  @IsOptional()
  transferNo?: string;
  @IsString()
  @IsOptional()
  initiinclbdr?: string;
  @IsString()
  @IsOptional()
  pickstatusid?: string;
 @IsString()
  @IsOptional()
  pickstatus?: string;


}