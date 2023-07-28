import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import { PassportModule } from "@nestjs/passport";
import { AlertQueryService } from "./alert-query/alert-query.service";
import { AlertHistoryQueryService } from "./alert-history/alert-history-query.service";
import { AlertEngineService } from "./alert-engine/alert-engine.service";
import { AlertIncidentService } from "./alert-engine/alert-incident.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" })
  ],
  providers: [
    AlertService,
    AlertQueryService,
    AlertHistoryQueryService,
    AlertEngineService,
    AlertIncidentService
  ],
  controllers: [AlertController],
  exports: [
    AlertService,
    AlertQueryService,
    AlertHistoryQueryService
  ]
})
export class AlertModule { }
