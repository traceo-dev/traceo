import { Module } from "@nestjs/common";
import { IncidentCommentsService } from "./incident-comments.service";
import { IncidentCommentsController } from "./incident-comments.controller";
import { PassportModule } from "@nestjs/passport";
import { IncidentCommentsQueryService } from "./query/incident-comments-query.service";
import { LiveService } from "src/common/services/live.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [IncidentCommentsService, IncidentCommentsQueryService, LiveService],
  controllers: [IncidentCommentsController],
  exports: [IncidentCommentsService, IncidentCommentsQueryService]
})
export class IncidentCommentsModule { }
