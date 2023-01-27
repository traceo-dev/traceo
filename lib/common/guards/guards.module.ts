import { Module } from '@nestjs/common';
import { AccountQueryService } from '../../api/account/account-query/account-query.service';
import { GuardsService } from './guards.service';

@Module({
  providers: [GuardsService, AccountQueryService],
  exports: [GuardsService]
})
export class GuardsModule { }
