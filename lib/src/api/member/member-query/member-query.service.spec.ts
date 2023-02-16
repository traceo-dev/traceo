import { Test, TestingModule } from '@nestjs/testing';
import { MemberQueryService } from './member-query.service';

describe('AwrQueryService', () => {
  let service: MemberQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberQueryService],
    }).compile();

    service = module.get<MemberQueryService>(MemberQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
