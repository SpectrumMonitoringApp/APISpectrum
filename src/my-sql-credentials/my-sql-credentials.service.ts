import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MySqlCredentials } from './entities/my-sql-credentials.entity';
import { CreateMySqlCredentialsDto } from './dto/create-my-sql-credentials.dto';

@Injectable()
export class MySqlCredentialsService {
  constructor(
    @InjectRepository(MySqlCredentials)
    private mySqlCredentialsRepository: Repository<MySqlCredentials>
  ) {
  }

  async create(mySqlCredentials: CreateMySqlCredentialsDto) {
    const newMySqlCredentials = this.mySqlCredentialsRepository.create(mySqlCredentials);

    await this.mySqlCredentialsRepository.save(newMySqlCredentials);

    return newMySqlCredentials;
  }
}
