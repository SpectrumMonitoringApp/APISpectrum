import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Request,
  Query,
  Param
} from '@nestjs/common';

import { CreateWorkspaceDto } from '../workspaces/dto/create-workspace.dto';
import { ResourcesService } from './resources.service';
import { CreateMySqlResourceDto } from './dto/create-my-sql-resource.dto';
import { UpdateResourceRequestBodyDto } from './dto/update-resource-request-body.dto';
import { CreateDataStoreDto } from '../data-stores/dto/create-data-store.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {
  }

  @HttpCode(HttpStatus.OK)
  @Post('/my-sql')
  createMySqlResource(@Request() req, @Body() createMySqlResource: CreateMySqlResourceDto) {
    return this.resourcesService.createMySqlResource(req.user.id, createMySqlResource);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/influx-db/record-count')
  getResourceRecordCount(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number, @Query('dataStoreIds') dataStoreIds: string) {
    return this.resourcesService.getResourceRecordCount(req.user.id, resourceId, workspaceId, dataStoreIds);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/influx-db/volume')
  getResourceVolume(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number, @Query('dataStoreIds') dataStoreIds: string) {
    return this.resourcesService.getResourceVolume(req.user.id, resourceId, workspaceId, dataStoreIds);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/influx-db/index-size')
  getResourceIndexSize(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number, @Query('dataStoreIds') dataStoreIds: string) {
    return this.resourcesService.getResourceIndexSize(req.user.id, resourceId, workspaceId, dataStoreIds);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getUserResources(@Request() req, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.getUserResources(req.user.id, workspaceId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getResource(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.getResource(req.user.id, workspaceId, resourceId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  updateResource(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number, @Body() updateResourceData: UpdateResourceRequestBodyDto) {
    console.log(updateResourceData);
    return this.resourcesService.updateResource(req.user.id, workspaceId, resourceId, updateResourceData.resource, updateResourceData.resourceCredentials);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/data-stores')
  getDataStores(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.getDataStores(req.user.id, workspaceId, resourceId);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/data-stores')
  createDataStore(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number, @Body() createDataStore: CreateDataStoreDto) {
    console.log('createDataStore: ', createDataStore);

    return this.resourcesService.createDataStore(req.user.id, workspaceId, resourceId, createDataStore.name);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/data-stores/:dataStoreId')
  deleteDataStore(@Request() req, @Param('id') resourceId: number, @Param('dataStoreId') dataStoreId: number, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.deleteDataStore(req.user.id, workspaceId, resourceId, dataStoreId);
  }
}
