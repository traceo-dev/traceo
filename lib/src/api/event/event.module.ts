import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventQueryService } from "./query/event-query.service";
import { ProjectQueryService } from "../project/project-query/project-query.service";

@Module({
  providers: [EventQueryService, ProjectQueryService],
  controllers: [EventController],
  exports: [EventQueryService]
})
export class EventModule {}
