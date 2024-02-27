import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

import { Resource } from './entities/resource.entity';
import { UsersModule } from '../users/users.module';
import { MySqlCredentialsModule } from '../my-sql-credentials/my-sql-credentials.module';
import { ResourceUsersModule } from '../resource-users/resource-users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), UsersModule, MySqlCredentialsModule, ResourceUsersModule, MySqlCredentialsModule],
  controllers: [ResourcesController],
  providers: [ResourcesService]
})
export class ResourcesModule {
}
