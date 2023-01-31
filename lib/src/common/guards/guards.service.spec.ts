import { Test, TestingModule } from '@nestjs/testing';
import { GuardsService } from './guards.service';

describe('AccountPermissionService', () => {
  let service: GuardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardsService],
    }).compile();

    service = module.get<GuardsService>(GuardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
