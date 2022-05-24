import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ReleaseQueryService } from './query/release-query.service';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    providers: [ReleaseQueryService, ReleaseService],
    controllers: [ReleaseController],
})
export class ReleaseModule { }
