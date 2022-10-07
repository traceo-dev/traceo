import { Test, TestingModule } from '@nestjs/testing';
import { AmrService } from './amr.service';

describe('AwrService', () => {
  let service: AmrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmrService],
    }).compile();

    service = module.get<AmrService>(AmrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
