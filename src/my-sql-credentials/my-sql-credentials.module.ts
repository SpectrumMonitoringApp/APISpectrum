import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MySqlCredentialsService } from './my-sql-credentials.service';
import { MySqlCredentials } from './entities/my-sql-credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MySqlCredentials])],
  providers: [MySqlCredentialsService],
  exports: [MySqlCredentialsService],

})
export class MySqlCredentialsModule {
}
