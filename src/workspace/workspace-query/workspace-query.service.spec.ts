import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceQueryService } from './workspace-query.service';

describe('WorkspaceQueryService', () => {
  let service: WorkspaceQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceQueryService],
    }).compile();

    service = module.get<WorkspaceQueryService>(WorkspaceQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
