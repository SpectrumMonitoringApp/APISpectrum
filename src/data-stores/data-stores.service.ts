import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async delete(id: number) {
    const dataStore = await this.dataStoreRepository.findOneBy({ id });

    if (!dataStore) return new HttpException(`DataStore with ${id} not found`, HttpStatus.NOT_FOUND);

    return await this.dataStoreRepository.remove(dataStore);
  }
}
