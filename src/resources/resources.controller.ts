import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Query, Param } from '@nestjs/common';

import { CreateWorkspaceDto } from '../workspaces/dto/create-workspace.dto';
import { ResourcesService } from './resources.service';
import { CreateMySqlResourceDto } from './dto/create-my-sql-resource.dto';

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
  @Get()
  getUserResources(@Request() req, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.getUserResources(req.user.id, workspaceId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getResource(@Request() req, @Param('id') resourceId: number, @Query('workspaceId') workspaceId: number) {
    return this.resourcesService.getResource(req.user.id, workspaceId, resourceId);
  }
}
