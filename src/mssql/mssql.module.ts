import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarcodeItem,ItemDetails } from './mssql.entity';
import { MssqlService } from './mssql.service';

@Module({
    imports: [TypeOrmModule.forFeature([BarcodeItem,ItemDetails], 'mssqlConn')],
  providers: [MssqlService],
    exports: [MssqlService],

})
export class MssqlModule {}
