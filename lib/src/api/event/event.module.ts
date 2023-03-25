import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventQueryService } from './query/event-query.service';

@Module({
  providers: [EventQueryService],
  controllers: [EventController],
  exports: [EventQueryService]
})
export class EventModule {}
