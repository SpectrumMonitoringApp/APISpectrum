import { Test, TestingModule } from '@nestjs/testing';
import { MySqlCredentialsService } from './my-sql-credentials.service';

describe('MySqlCredentialsService', () => {
  let service: MySqlCredentialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MySqlCredentialsService],
    }).compile();

    service = module.get<MySqlCredentialsService>(MySqlCredentialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
