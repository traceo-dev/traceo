import { Test, TestingModule } from '@nestjs/testing';
import { AccountPermissionService } from './account-permission.service';

describe('AccountPermissionService', () => {
  let service: AccountPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountPermissionService],
    }).compile();

    service = module.get<AccountPermissionService>(AccountPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
