import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AmrService } from '../application-member/amr.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from './application-query/application-query.service';
import { AmrQueryService } from '../application-member/amr-query/amr-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';
import { GuardsService } from '@common/guards/guards.service';
import { MetricsService } from '../metrics/metrics.service';
import { ApplicationsController } from './applications.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [
    ApplicationService,
    ApplicationQueryService,
    AmrService,
    AmrQueryService,
    AccountQueryService,
    GuardsService,
    MetricsService
  ],
  controllers: [
    ApplicationsController,
    ApplicationController
  ],
  exports: [
    ApplicationService,
    ApplicationQueryService
  ]
})
export class ApplicationModule { }
