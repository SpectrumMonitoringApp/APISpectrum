import { Module } from '@nestjs/common';
import { MongoDbCredentialsService } from './mongo-db-credentials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoDbCredentials } from './entities/mongo-db-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MongoDbCredentials])],
  providers: [MongoDbCredentialsService],
  exports: [MongoDbCredentialsService]
})
export class MongoDbCredentialsModule {}
