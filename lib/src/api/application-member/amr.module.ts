import { Module } from '@nestjs/common';
import { AmrService } from './amr.service';
import { AmrController } from './amr.controller';
import { AmrQueryService } from './amr-query/amr-query.service';
import { PassportModule } from '@nestjs/passport';
import { ApplicationQueryService } from '../application/application-query/application-query.service';
import { AccountQueryService } from '../account/account-query/account-query.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  providers: [
    AmrService,
    AmrQueryService,
    ApplicationQueryService,
    AccountQueryService
  ],
  controllers: [AmrController],
  exports: [
    AmrService,
    AmrQueryService
  ]
})
export class AmrModule { }
