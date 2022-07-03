import { Test, TestingModule } from '@nestjs/testing';
import { AwrService } from './awr.service';

describe('AwrService', () => {
  let service: AwrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwrService],
    }).compile();

    service = module.get<AwrService>(AwrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
