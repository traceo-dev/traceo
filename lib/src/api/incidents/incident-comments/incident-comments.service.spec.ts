import { IncidentCommentsService } from "./incident-comments.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("CommentsService", () => {
  let service: IncidentCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentCommentsService]
    }).compile();

    service = module.get<IncidentCommentsService>(IncidentCommentsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
