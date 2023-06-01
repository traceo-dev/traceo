import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserQueryService } from "../user/user-query/user-query.service";
import { IncidentsQueryService } from "./incidents-query/incidents-query.service";
import { IncidentsController } from "./incidents.controller";
import { IncidentsService } from "./incidents.service";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [IncidentsQueryService, IncidentsService, UserQueryService],
  controllers: [IncidentsController],
  exports: [IncidentsQueryService, IncidentsService]
})
export class IncidentsModule {}
