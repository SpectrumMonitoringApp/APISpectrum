import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResourceUsersService } from './resource-users.service';
import { ResourceUser } from './entities/resource-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceUser])],
  providers: [ResourceUsersService],
  exports: [ResourceUsersService]
})
export class ResourceUsersModule {
}
