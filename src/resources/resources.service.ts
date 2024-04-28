import 'dotenv/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCipheriv, createDecipheriv } from 'crypto';
import { promisify } from 'util';

import { Resource, ResourceType } from './entities/resource.entity';
import { UsersService } from '../users/users.service';
import { CreateMySqlResourceDto } from './dto/create-my-sql-resource.dto';
import { MySqlCredentialsService } from '../my-sql-credentials/my-sql-credentials.service';
import { ResourceUsersService } from '../resource-users/resource-users.service';
import { ResourceUserRole } from '../resource-users/entities/resource-user.entity';
import { MySqlCredentials } from 'src/my-sql-credentials/entities/my-sql-credentials.entity';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { UpdateResourceCredentialsDto } from './dto/update-resource-credentials.dto';
import { DataStoresService } from '../data-stores/data-stores.service';
import { InfluxDbService } from '../influx-db/influx-db.service';
import { CryptoService } from '../crypto/crypto.service';
import { MongoDbCredentialsService } from '../mongo-db-credentials/mongo-db-credentials.service';
import { CreateMongoDbResourceDto } from './dto/create-mongo-db-resource.dto';
import { MongoDbCredentials } from '../mongo-db-credentials/entities/mongo-db-credentials.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourcesRepository: Repository<Resource>,
    @InjectRepository(MySqlCredentials)
    private mySqlCredentialsRepository: Repository<MySqlCredentials>,
    @InjectRepository(MongoDbCredentials)
    private mongoDbCredentialsRepository: Repository<MongoDbCredentials>,
    private usersService: UsersService,
    private mySqlCredentialsService: MySqlCredentialsService,
    private resourceUsersService: ResourceUsersService,
    private dataStoresService: DataStoresService,
    private influxDbService: InfluxDbService,
    private cryptoService: CryptoService,
    private mongoDbCredentialsService: MongoDbCredentialsService

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
      host: this.cryptoService.encrypt(mySqlResource.host),
      port: this.cryptoService.encrypt(mySqlResource.port),
      username: this.cryptoService.encrypt(mySqlResource.username),
      password: this.cryptoService.encrypt(mySqlResource.password),
      databaseName: this.cryptoService.encrypt(mySqlResource.databaseName)
    };

    await Promise.all([this.mySqlCredentialsService.create(mySqlCredentials), this.resourceUsersService.create(userId, resource.id, ResourceUserRole.ADMIN)]);

    return resource.id;
  }

  async createMongoDbResource(userId: number, mongoDbResource: CreateMongoDbResourceDto) {
    const resource = await this.create(userId, mongoDbResource.workspaceId, mongoDbResource.name, mongoDbResource.type, mongoDbResource.isActive, mongoDbResource.pollInterval);

    const mongoDBCredentials = {
      resourceId: resource.id,
      uri: this.cryptoService.encrypt(mongoDbResource.uri),
      databaseName: this.cryptoService.encrypt(mongoDbResource.databaseName)
    };

    await Promise.all([this.mongoDbCredentialsService.create(mongoDBCredentials), this.resourceUsersService.create(userId, resource.id, ResourceUserRole.ADMIN)]);

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

    if (resource.type === ResourceType.MYSQL) {
      const mySqlCredentials = await this.mySqlCredentialsService.findOne(resourceId);

      resourceCredentials = {
        ...mySqlCredentials,
        host: this.cryptoService.decrypt(mySqlCredentials.host),
        port: this.cryptoService.decrypt(mySqlCredentials.port, true),
        username: this.cryptoService.decrypt(mySqlCredentials.username),
        password: this.cryptoService.decrypt(mySqlCredentials.password),
        databaseName: this.cryptoService.decrypt(mySqlCredentials.databaseName)
      };
    }

    if (resource.type === ResourceType.MONGODB) {
      const mongoDbCredentials = await this.mongoDbCredentialsService.findOne(resourceId);

      resourceCredentials = {
        ...mongoDbCredentials,
        uri: this.cryptoService.decrypt(mongoDbCredentials.uri),
        databaseName: this.cryptoService.decrypt(mongoDbCredentials.databaseName)
      };
    }

    return { resource, resourceCredentials };
  }

  async updateResource(userId: number, workspaceId: number, resourceId: number, resourceData: UpdateResourceDto, resourceCredentialsData: UpdateResourceCredentialsDto) {
    const { resource, resourceCredentials } = await this.getResource(userId, workspaceId, resourceId);

    for (const [key, value] of Object.entries(resourceData)) {
      resource[key] = value;
    }

    for (const [key, value] of Object.entries(resourceCredentialsData)) {
      resourceCredentials[key] = this.cryptoService.encrypt(value);
    }

    await this.resourcesRepository.save(resource);

    if (!Object.keys(resourceCredentialsData).length) return { res: 'OK' };

    if (resource.type === ResourceType.MYSQL) await this.mySqlCredentialsRepository.save(resourceCredentials);

    if (resource.type === ResourceType.MONGODB) await this.mongoDbCredentialsRepository.save(resourceCredentials);

    return { res: 'OK' };
  }

  async getDataStores(userId: number, workspaceId: number, resourceId: number) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    const resource = await this.resourcesRepository.findOne({
      relations: { dataStores: true },
      where: { id: +resourceId }
    });

    if (!resource) throw new HttpException(`Resource ${resourceId} value for user ${userId} not found`, HttpStatus.NOT_FOUND);

    const { dataStores } = resource;

    return dataStores;
  }

  async createDataStore(userId: number, workspaceId: number, resourceId: number, dataStoreName: string) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    return await this.dataStoresService.create(resourceId, dataStoreName);
  }

  async deleteDataStore(userId: number, workspaceId: number, resourceId: number, dataStoreId: number) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    return await this.dataStoresService.delete(dataStoreId);
  }

  async getActiveResourceForPolling() {
    return this.resourcesRepository.find({
      where: { isActive: true },
      relations: { dataStores: true },
      select: { id: true, type: true, pollInterval: true, dataStores: { id: true, name: true } }
    });
  }

  async getResourceRecordCount(userId: number, resourceId: number, workspaceId: number, dataStoreIds: string) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    return await this.influxDbService.getResourceInfluxDbData(resourceId, JSON.parse(decodeURI(dataStoreIds)), 'RecordCount');
  }

  async getResourceVolume(userId: number, resourceId: number, workspaceId: number, dataStoreIds: string) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    return await this.influxDbService.getResourceInfluxDbData(resourceId, JSON.parse(decodeURI(dataStoreIds)), 'DataStoreVolume');
  }

  async getResourceIndexSize(userId: number, resourceId: number, workspaceId: number, dataStoreIds: string) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    if (!await this.usersService.hasAccessToWorkspace(userId, +workspaceId)) throw new HttpException(`User ${userId} has no access to workspace ${workspaceId}`, HttpStatus.FORBIDDEN);

    if (!await this.resourceUsersService.userHasAccess(userId, +resourceId)) throw new HttpException(`User ${userId} has no access to resource ${resourceId}`, HttpStatus.FORBIDDEN);

    return await this.influxDbService.getResourceInfluxDbData(resourceId, JSON.parse(decodeURI(dataStoreIds)), 'IndexSize');
  }
}
