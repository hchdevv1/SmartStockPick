import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Stockrequest,StrockPickTransactions} from './postgres.entity';
import { PostgresService } from './postgres.service';

@Module({
   imports: [TypeOrmModule.forFeature([Stockrequest,StrockPickTransactions], 'postgresConn')],

  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule {}
