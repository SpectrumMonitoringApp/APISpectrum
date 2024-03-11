import { Injectable } from '@nestjs/common';
import { ResourcesService } from '../resources/resources.service';

@Injectable()
export class InternalComponentsService {
  constructor(
    private resourcesService: ResourcesService
  ) {
  }

  async getActiveResourcesToPoll() {
    return [{ id: 1 }, { id: 2 }];
  }
}
