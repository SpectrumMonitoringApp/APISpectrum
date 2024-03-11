import { Module } from '@nestjs/common';

import { InternalComponentsService } from './internal-components.service';
import { InternalComponentsController } from './internal-components.controller';
import { ResourcesModule } from '../resources/resources.module';

@Module({
  imports: [ResourcesModule],
  controllers: [InternalComponentsController],
  providers: [InternalComponentsService],
})
export class InternalComponentsModule {}
