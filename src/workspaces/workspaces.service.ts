import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    private usersService: UsersService
  ) {
  }

  async create(userId: number, workspace: CreateWorkspaceDto) {
    const newWorkspace = this.workspacesRepository.create(workspace);

    await this.workspacesRepository.save(newWorkspace);
    await this.usersService.addUserWorkspace(userId, newWorkspace);

    return newWorkspace;
  }

  async getUserWorkspaces(userId: number) {
    if (!userId) throw new HttpException(`Invalid userId ${userId} value`, HttpStatus.BAD_REQUEST);

    const userWorkspaces = await this.workspacesRepository.find({
      relations: { users: true },
      select: { id: true, name: true, users: { id: true } },
      where: { users: { id: userId } }
    });

    return userWorkspaces.map(({ id, name }) => ({ id, name }));
  }
}
