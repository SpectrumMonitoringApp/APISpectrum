import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MongoDbCredentialsService } from './mongo-db-credentials.service';
import { CreateMongoDbCredentialDto } from './dto/create-mongo-db-credential.dto';
import { UpdateMongoDbCredentialDto } from './dto/update-mongo-db-credential.dto';

@Controller('mongo-db-credentials')
export class MongoDbCredentialsController {
  constructor(private readonly mongoDbCredentialsService: MongoDbCredentialsService) {}

  @Post()
  create(@Body() createMongoDbCredentialDto: CreateMongoDbCredentialDto) {
    return this.mongoDbCredentialsService.create(createMongoDbCredentialDto);
  }
}
