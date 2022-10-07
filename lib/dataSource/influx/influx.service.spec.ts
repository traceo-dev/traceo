import { Test, TestingModule } from '@nestjs/testing';
import { InfluxService } from './influx.service';

describe('InfluxService', () => {
  let service: InfluxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluxService],
    }).compile();

    service = module.get<InfluxService>(InfluxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
