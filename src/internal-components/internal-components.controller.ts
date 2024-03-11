import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { InternalComponentsService } from './internal-components.service';
import { InternalScheduler } from '../auth/decorators/isInternalScheduler.decorator';

@Controller('internal-components')
export class InternalComponentsController {
  constructor(private readonly internalComponentsService: InternalComponentsService) {
  }

  @InternalScheduler()
  @HttpCode(HttpStatus.OK)
  @Get('/scheduler')
  getActiveResourcesToPoll() {
    return this.internalComponentsService.getActiveResourcesToPoll();
  }
}
