import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [IncidentsQueryService, IncidentsService],
  controllers: [IncidentsController]
})
export class IncidentsModule {}
