import { Controller, Body, Request, HttpCode, HttpStatus, Post, Get, Param } from '@nestjs/common';

import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Request() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(req.user.id, createWorkspaceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getUserWorkspaces(@Request() req) {
    return this.workspacesService.getUserWorkspaces(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getWorkspace(@Request() req, @Param('id') workspaceId: number) {
    return this.workspacesService.getWorkspace(req.user.id, workspaceId);
  }
}
