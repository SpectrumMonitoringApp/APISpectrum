import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

import { Resource } from './entities/resource.entity';
import { UsersModule } from '../users/users.module';
import { MySqlCredentialsModule } from '../my-sql-credentials/my-sql-credentials.module';
import { ResourceUsersModule } from '../resource-users/resource-users.module';
import { MySqlCredentials } from '../my-sql-credentials/entities/my-sql-credentials.entity';
import { DataStoresModule } from '../data-stores/data-stores.module';
import { InfluxDbModule } from '../influx-db/influx-db.module';
import { CryptoModule } from '../crypto/crypto.module';
import { MongoDbCredentialsModule } from '../mongo-db-credentials/mongo-db-credentials.module';
import { MongoDbCredentials } from '../mongo-db-credentials/entities/mongo-db-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), TypeOrmModule.forFeature([MySqlCredentials]), UsersModule, MySqlCredentialsModule, ResourceUsersModule, MySqlCredentialsModule, DataStoresModule, InfluxDbModule, CryptoModule, MongoDbCredentialsModule, TypeOrmModule.forFeature([MongoDbCredentials])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService]
})
export class ResourcesModule {
}
