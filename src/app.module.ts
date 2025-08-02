import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockpickModule } from './stockpick/stockpick.module';
import { TrakcareModule } from './trakcare/trakcare.module';
import { ConfigModule } from '@nestjs/config';
import { MssqlModule } from './mssql/mssql.module';
import { PostgresModule } from './postgres/postgres.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      name: 'mssqlConn',
      type: 'mssql',
      host:  process.env.MSSQL_NAV_HOST, //'10.10.16.32',
      port: Number(process.env.MSSQL_NAV_PORT),
      username: process.env.MSSQL_NAV_USER, //'sa',
      password: process.env.MSSQL_NAV_PASSWORD, //'HcH@3480',
      database: process.env.MSSQL_NAV_DATABASE, //'HCH_BC220TEST_20250121',
      entities: [__dirname + '/mssql/*.entity{.ts,.js}'], // ดึงทั้งหมด
      synchronize: false,
      options: { encrypt: false },
    }),

 
    TypeOrmModule.forRoot({
      name: 'postgresConn',
      type: 'postgres',
      host: process.env.PG_SmartStockPick_HOST,
      port: Number(process.env.PG_SmartStockPick_PORT),
      username: process.env.PG_SmartStockPick_USER,
      password: process.env.PG_SmartStockPick_PASSWORD ,
      database: process.env.PG_SmartStockPick_DATABASE , 
      entities: [__dirname + '/postgres/*.entity{.ts,.js}'], // ดึงทั้งหมด
      synchronize: false,

    }),
    StockpickModule, TrakcareModule,
    MssqlModule, PostgresModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
