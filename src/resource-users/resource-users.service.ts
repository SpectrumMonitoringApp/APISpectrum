import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceUser, ResourceUserRole } from './entities/resource-user.entity';

@Injectable()
export class ResourceUsersService {
  constructor(
    @InjectRepository(ResourceUser)
    private resourceUsersRepository: Repository<ResourceUser>
  ) {
  }

  async create(userId: number, resourceId: number, role: ResourceUserRole) {
    const resourceUser = { resourceId, userId, role };
    const newResourceUser = this.resourceUsersRepository.create(resourceUser);

    await this.resourceUsersRepository.save(newResourceUser);

    return newResourceUser;
  }
}
