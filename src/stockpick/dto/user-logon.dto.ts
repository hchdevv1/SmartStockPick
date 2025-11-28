import { IsOptional, IsString } from 'class-validator';

export class UserLogonQueryDto {
  @IsOptional()
  @IsString()
  userid?: string;

  @IsOptional()
  @IsString()
  password?: string;

}
