import { Injectable } from '@nestjs/common';
import { CreateMongoDbCredentialDto } from './dto/create-mongo-db-credential.dto';
import { UpdateMongoDbCredentialDto } from './dto/update-mongo-db-credential.dto';

@Injectable()
export class MongoDbCredentialsService {
  create(createMongoDbCredentialDto: CreateMongoDbCredentialDto) {
    return 'This action adds a new mongoDbCredential';
  }
}
