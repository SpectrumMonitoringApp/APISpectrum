import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataStore } from './entities/data-store.entity';
import { DataStoresService } from './data-stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataStore])],
  providers: [DataStoresService],
  exports: [DataStoresService],
})
export class DataStoresModule {}
