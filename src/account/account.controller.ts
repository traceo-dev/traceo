import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountDto } from './account.model';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(
        readonly accountService: AccountService,
        readonly accountQueryService: AccountQueryService
    ) { }

    @Patch()
    @AuthRequired()
    async updateAccount(
        @Body() accountDto: AccountDto,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.accountService.updateAccount({ id: account.id, ...accountDto });
    }

    @Get("/confirm")
    async confirmAccount(
        @Query('hash') hash: string,
        @Query('applicationId') applicationId: number,
    ): Promise<void> {
        return await this.accountService.confirmAccount(hash, applicationId);
    }

    @Delete()
    @AuthRequired()
    public async deleteApplication(
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.accountService.deleteAccount(account);
    }
}
