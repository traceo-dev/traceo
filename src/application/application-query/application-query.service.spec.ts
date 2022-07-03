import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationQueryService } from './application-query.service';

describe('ApplicationQueryService', () => {
  let service: ApplicationQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationQueryService],
    }).compile();

    service = module.get<ApplicationQueryService>(ApplicationQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
