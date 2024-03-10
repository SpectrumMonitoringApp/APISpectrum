import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DataStore } from './entities/data-store.entity';
import { CreateMySqlCredentialsDto } from '../my-sql-credentials/dto/create-my-sql-credentials.dto';

@Injectable()
export class DataStoresService {
  constructor(
    @InjectRepository(DataStore)
    private dataStoreRepository: Repository<DataStore>
  ) {
  }

  async create(resourceId: number, name: string) {
    const dataStore = this.dataStoreRepository.create({ resourceId, name });

    await this.dataStoreRepository.save(dataStore);

    return dataStore;
  }
}
