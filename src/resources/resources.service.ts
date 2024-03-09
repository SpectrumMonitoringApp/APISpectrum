import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resource, ResourceType } from './entities/resource.entity';
import { UsersService } from '../users/users.service';
import { CreateMySqlResourceDto } from './dto/create-my-sql-resource.dto';
import { MySqlCredentialsService } from '../my-sql-credentials/my-sql-credentials.service';
import { ResourceUsersService } from '../resource-users/resource-users.service';
import { ResourceUserRole } from '../resource-users/entities/resource-user.entity';
import { MySqlCredentials } from 'src/my-sql-credentials/entities/my-sql-credentials.entity';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { UpdateResourceCredentialsDto } from './dto/update-resource-credentials.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(MySqlCredentials)
    private mySqlCredentialsRepository: Repository<MySqlCredentials>,
    private usersService: UsersService,
    private mySqlCredentialsService: MySqlCredentialsService,
    private resourceUsersService: ResourceUsersService
  ) {
  }

  async create(userId: number, workspaceId: number, name: string, type: ResourceType, isActive: boolean, pollInterval: number) {
    if (!await this.usersService.hasAccessToWorkspace(userId, workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    const resource = { workspaceId, name, type, isActive, pollInterval };

    const newResource = this.resourcesRepository.create(resource);

    await this.resourcesRepository.save(newResource);

    return newResource;
  }

  async createMySqlResource(userId: number, mySqlResource: CreateMySqlResourceDto) {
    const resource = await this.create(userId, mySqlResource.workspaceId, mySqlResource.name, mySqlResource.type, mySqlResource.isActive, mySqlResource.pollInterval);

    const mySqlCredentials = {
      resourceId: resource.id,
      host: mySqlResource.host,
      port: mySqlResource.port,
      username: mySqlResource.username,
      password: mySqlResource.password,
      databaseName: mySqlResource.databaseName
    };

    await Promise.all([this.mySqlCredentialsService.create(mySqlCredentials), this.resourceUsersService.create(userId, resource.id, ResourceUserRole.ADMIN)]);

    return resource.id;
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

  async getResource(userId: number, workspaceId: number, resourceId: number) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    const resource = await this.resourcesRepository.findOneBy({ id: +resourceId });

    let resourceCredentials: any;

    if (resource.type === ResourceType.MYSQL) resourceCredentials = await this.mySqlCredentialsService.findOne(resourceId);

    return { resource, resourceCredentials };
  }

  async updateResource(userId: number, workspaceId: number, resourceId: number, resourceData: UpdateResourceDto, resourceCredentialsData: UpdateResourceCredentialsDto) {
    const { resource, resourceCredentials } = await this.getResource(userId, workspaceId, resourceId);

    for (const [key, value] of Object.entries(resourceData)) {
      resource[key] = value;
    }

    for (const [key, value] of Object.entries(resourceCredentialsData)) {
      resourceCredentials[key] = value;
    }

    await this.resourcesRepository.save(resource);

    if (resource.type === ResourceType.MYSQL) await this.mySqlCredentialsRepository.save(resourceCredentials);

    return { res: 'OK' };
  }
}
