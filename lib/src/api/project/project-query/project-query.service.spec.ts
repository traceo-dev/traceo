import { ProjectQueryService } from "./project-query.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("ProjectQueryService", () => {
  let service: ProjectQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectQueryService]
    }).compile();

    service = module.get<ProjectQueryService>(ProjectQueryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
