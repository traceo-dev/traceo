import { Test, TestingModule } from '@nestjs/testing';
import { AccountQueryService } from './account-query.service';

describe('AccountQueryService', () => {
  let service: AccountQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountQueryService],
    }).compile();

    service = module.get<AccountQueryService>(AccountQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
