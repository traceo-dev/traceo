import { Module } from '@nestjs/common';
import { AccountQueryService } from '../account-query/account-query.service';
import { AccountPermissionService } from './account-permission.service';

@Module({
  providers: [AccountPermissionService, AccountQueryService]
})
export class AccountPermissionModule { }
