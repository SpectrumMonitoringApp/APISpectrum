import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resource } from './entities/resource.entity';
import { ResourceType } from './entities/resource.entity';
import { UsersService } from '../users/users.service';
import { CreateMySqlResourceDto } from './dto/create-my-sql-resource.dto';
import { MySqlCredentialsService } from '../my-sql-credentials/my-sql-credentials.service';
import { ResourceUsersService } from '../resource-users/resource-users.service';
import { ResourceUserRole } from '../resource-users/entities/resource-user.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    private usersService: UsersService,
    private mySqlCredentialsService: MySqlCredentialsService,
    private resourceUsersService: ResourceUsersService
  ) {
  }

  async create(userId: number, workspaceId: number, name: string, type: ResourceType) {
    if (!await this.usersService.hasAccessToWorkspace(userId, workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    const resource = { workspaceId, name, type };
    const newResource = this.resourcesRepository.create(resource);

    await this.resourcesRepository.save(newResource);

    return newResource;
  }

  async createMySqlResource(userId: number, mySqlResource: CreateMySqlResourceDto) {
    const resource = await this.create(userId, mySqlResource.workspaceId, mySqlResource.name, mySqlResource.type);
    const mySqlCredentials = {
      resourceId: resource.id,
      host: mySqlResource.host,
      port: mySqlResource.port,
      username: mySqlResource.username,
      password: mySqlResource.password,
      databaseName: mySqlResource.databaseName
    };
    const createdMySqlCredentials = await this.mySqlCredentialsService.create(mySqlCredentials);

    await this.resourceUsersService.create(userId, resource.id, ResourceUserRole.ADMIN);

    return createdMySqlCredentials.id;
  }

  async getUserResources(userId: number, workspaceId: number) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    const userResources = await this.resourcesRepository.find({
      relations: {
        resourceUsers: true
      },
      select: { id: true, name: true, type: true },
      where: { workspaceId: +workspaceId, resourceUsers: { userId } }
    });

    return userResources.map(({ id, name, type }) => ({ id, name, type }));
  }
}
