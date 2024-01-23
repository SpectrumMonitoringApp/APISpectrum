import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { Workspace } from './workspaces/entities/workspace.entity';
import { ResourcesModule } from './resources/resources.module';
import { Resource } from './resources/entities/resource.entity';
import { ResourceUsersModule } from './resource-users/resource-users.module';
import { ResourceUser } from './resource-users/entities/resource-user.entity';
import { MySqlCredentialsModule } from './my-sql-credentials/my-sql-credentials.module';
import { MySqlCredentials } from './my-sql-credentials/entities/my-sql-credentials.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: 3306,
      username: process.env.MYSQL_DB_ADMIN_USERNAME,
      password: process.env.MYSQL_DB_ADMIN_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE,
      entities: [User, Workspace, Resource, ResourceUser, MySqlCredentials]
    }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ResourcesModule,
    ResourceUsersModule,
    MySqlCredentialsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
