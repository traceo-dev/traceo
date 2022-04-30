import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongodbModule } from 'src/db/mongodb.module';
import { ReleaseQueryService } from './query/release-query.service';
import { ReleaseController } from './release.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MongodbModule],
    providers: [ReleaseQueryService],
    controllers: [ReleaseController],
})
export class ReleaseModule { }
