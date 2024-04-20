import { Injectable } from '@nestjs/common';
import { CreateMongoDbCredentialDto } from './dto/create-mongo-db-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MongoDbCredentials } from './entities/mongo-db-credentials.entity';

@Injectable()
export class MongoDbCredentialsService {
  constructor(
    @InjectRepository(MongoDbCredentials)
    private mongoDbCredentialsRepository: Repository<MongoDbCredentials>
  ) {
  }

  async create(createMongoDbCredentialDto: CreateMongoDbCredentialDto) {
    const newMongoDbCredentials = this.mongoDbCredentialsRepository.create(createMongoDbCredentialDto);

    await this.mongoDbCredentialsRepository.save(newMongoDbCredentials);

    return newMongoDbCredentials;
  }

  async findOne(resourceId: number) {
    return await this.mongoDbCredentialsRepository.findOneBy({ resourceId });
  }
}
