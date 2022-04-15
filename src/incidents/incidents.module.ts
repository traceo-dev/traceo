import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoreService } from 'src/core/core.service';
import { MongodbModule } from 'src/db/mongodb.module';
import { IncidentsQueryService } from './incidents-query/incidents-query.service';
import { IncidentsController } from './incidents.controller';

@Module({
    imports: [
        MongodbModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [IncidentsQueryService, CoreService],
    controllers: [IncidentsController]
})
export class IncidentsModule {}
