import { Test, TestingModule } from '@nestjs/testing';
import { AmrQueryService } from './amr-query.service';

describe('AwrQueryService', () => {
  let service: AmrQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrQueryService],
    }).compile();

    service = module.get<AmrQueryService>(AmrQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
