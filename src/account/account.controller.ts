import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/middlewares/auth-required.decorator';
import { AccountDto } from './account.model';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
    constructor(
        readonly accountService: AccountService
    ) {}

    @Get('/:id')
    async getAccountById(
        @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<Account | null> {
        return await this.accountService.getAccountById(id);
    }

    @Patch()
    @AuthRequired()
    async updateAccount(
        @Body() accountDto: AccountDto,
    ): Promise<void> {
        return await this.accountService.updateAccount(accountDto);
    }

    @Get("/:hash/:workspaceId")
    async confirmAccount(
        @Param('hash') hash: string,
        @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    ): Promise<void> {
        return await this.accountService.confirmAccount(hash, workspaceId);
    }
}
