import { Test, TestingModule } from '@nestjs/testing';
import { AwrQueryService } from './awr-query.service';

describe('AwrQueryService', () => {
  let service: AwrQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwrQueryService],
    }).compile();

    service = module.get<AwrQueryService>(AwrQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
