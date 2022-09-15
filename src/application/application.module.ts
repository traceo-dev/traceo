import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AmrService } from 'src/application-member/amr.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from './application-query/application-query.service';
import { AmrQueryService } from 'src/application-member/amr-query/amr-query.service';
import { AccountQueryService } from 'src/account/account-query/account-query.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [
    ApplicationService,
    AmrService,
    AmrQueryService,
    AccountQueryService,
    ApplicationQueryService
  ],
  controllers: [ApplicationController]
})
export class ApplicationModule {}
