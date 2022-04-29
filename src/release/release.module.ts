import { Module } from '@nestjs/common';
import { MongodbModule } from 'src/db/mongodb.module';
import { ReleaseQueryService } from './query/release-query.service';

@Module({
    imports: [MongodbModule],
    providers: [ReleaseQueryService],
})
export class ReleaseModule {}
