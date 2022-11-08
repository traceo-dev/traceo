import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountPermissionService } from 'lib/account/account-permission/account-permission.service';
import { AccountQueryService } from 'lib/account/account-query/account-query.service';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [IncidentsQueryService, IncidentsService, AccountQueryService, AccountPermissionService],
  controllers: [IncidentsController]
})
export class IncidentsModule { }
