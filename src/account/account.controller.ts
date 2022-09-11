import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountDto, CreateAccountDto } from './account.model';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(
        readonly accountService: AccountService,
        readonly accountQueryService: AccountQueryService
    ) { }

    @Get()
    @AuthRequired()
    async getApplication(
        @Query('id') id: string,
    ): Promise<Account> {
        return await this.accountQueryService.getDto(id);
    }

    @Get('/all')
    @AuthRequired()
    async getAccounts(
        @Query() query: BaseDtoQuery
    ): Promise<Account[]> {
        return await this.accountQueryService.listDto(query);
    }

    @Post('/new')
    async createAccount(@Body() accountDto: CreateAccountDto): Promise<any> {
        return this.accountService.createAccount(accountDto);
    }

    @Patch()
    @AuthRequired()
    async updateAccount(
        @Body() accountDto: AccountDto,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.accountService.updateAccount(account.id, accountDto);
    }

    @Delete('/:id')
    @AuthRequired()
    public async deleteAccount(
        @Param("id") id: string,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.accountService.deleteAccount(id, account);
    }
}
