import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ResourcesModule } from './resources/resources.module';
import { ResourceUsersModule } from './resource-users/resource-users.module';
import { MySqlCredentialsModule } from './my-sql-credentials/my-sql-credentials.module';
import { dataSourceOptions } from './db/my-sql/data-source';
import { DataStoresModule } from './data-stores/data-stores.module';
import { InternalComponentsModule } from './internal-components/internal-components.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ResourcesModule,
    ResourceUsersModule,
    MySqlCredentialsModule,
    DataStoresModule,
    InternalComponentsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
