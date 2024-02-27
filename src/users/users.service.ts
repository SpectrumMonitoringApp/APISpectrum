import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
  }

  async create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);

    await this.usersRepository.save(newUser);

    return newUser;
  }

  async addUserWorkspace(userId: number, workspace: Workspace) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { workspaces: true } });

    user.workspaces = [...user.workspaces, workspace];

    return await this.usersRepository.save(user);
  }

  async hasAccessToWorkspace(userId: number, workspaceId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { workspaces: true } });

    console.log(user);

    return user.workspaces.find(({ id }) => id === +workspaceId);
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}