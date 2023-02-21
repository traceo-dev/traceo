import { ApplicationService } from "./application.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("ApplicationService", () => {
  let service: ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationService]
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
