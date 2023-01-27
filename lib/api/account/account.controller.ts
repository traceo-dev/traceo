import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuardsService } from '../../common/guards/guards.service';
import { AuthAccount } from '../../common/decorators/auth-user.decorator';
import { CreateAccountDto, AccountDto } from '../../common/types/dto/account.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { IAccount, RequestUser } from '../../common/types/interfaces/account.interface';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountService } from './account.service';
import { Request } from "express";
import { AuthGuard } from 'lib/common/decorators/auth-guard.decorator';

@ApiTags('account')
@Controller('account')
@UseGuards(new AuthGuard())
export class AccountController {
  constructor(
    readonly accountService: AccountService,
    readonly accountQueryService: AccountQueryService,
    readonly permission: GuardsService
  ) { }

  @Get()
  async getSignedInAccount(@Req() req: Request): Promise<ApiResponse<IAccount>> {
    return await this.accountQueryService.getSignedInAccount(req);
  }

  @Post('/new')
  async createAccount(
    @Body() accountDto: CreateAccountDto,
    @AuthAccount() account: RequestUser
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('CREATE_ACCOUNT', account);

    return this.accountService.createAccount(accountDto);
  }

  @Patch()
  async updateAccount(
    @Body() accountDto: AccountDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    return await this.accountService.updateAccountApi(account.id, accountDto);
  }

  @Delete('/:id')
  public async deleteAccount(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE ACCOUNT', account);

    return await this.accountService.deleteAccount(id, account);
  }
}
