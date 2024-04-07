import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InfluxDbService } from './influx-db.service';
import { DataStore } from '../data-stores/entities/data-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataStore])],
  providers: [InfluxDbService],
  exports: [InfluxDbService]
})
export class InfluxDbModule {}
