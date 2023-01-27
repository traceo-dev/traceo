import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GuardsService } from '../../common/guards/guards.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import { IncidentCommentsModule } from './incident-comments/incident-comments.module';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    IncidentCommentsModule
  ],
  providers: [
    IncidentsQueryService,
    IncidentsService,
    AccountQueryService,
    GuardsService
  ],
  controllers: [IncidentsController],
  exports: [
    IncidentsQueryService,
    IncidentsService
  ]
})
export class IncidentsModule { }
