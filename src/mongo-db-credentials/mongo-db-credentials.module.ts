import { Module } from '@nestjs/common';
import { MongoDbCredentialsService } from './mongo-db-credentials.service';
import { MongoDbCredentialsController } from './mongo-db-credentials.controller';

@Module({
  controllers: [MongoDbCredentialsController],
  providers: [MongoDbCredentialsService],
})
export class MongoDbCredentialsModule {}
