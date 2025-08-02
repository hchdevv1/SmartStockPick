import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { StockpickService } from './stockpick.service';
import { StockpickController } from './stockpick.controller';
import { TrakcareService } from '../trakcare/trakcare.service'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MssqlService } from '../mssql/mssql.service';
import { MssqlModule } from '../mssql/mssql.module';
import { BarcodeItem,ItemDetails } from '../mssql/mssql.entity';

import { PostgresModule} from '../postgres/postgres.module';
import { PostgresService} from '../postgres/postgres.service';
import { Stockrequest,StrockPickTransactions} from '../postgres/postgres.entity';




@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([BarcodeItem,ItemDetails], 'mssqlConn'),
    TypeOrmModule.forFeature([Stockrequest,StrockPickTransactions], 'postgresConn'),
    MssqlModule,PostgresModule
  ],
  controllers: [StockpickController],
  providers: [StockpickService, MssqlService,PostgresService,TrakcareService],
})
export class StockpickModule {}
