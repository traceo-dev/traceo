import { Test, TestingModule } from '@nestjs/testing';
import { AcrService } from './acr.service';

describe('AcrService', () => {
  let service: AcrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcrService],
    }).compile();

    service = module.get<AcrService>(AcrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
