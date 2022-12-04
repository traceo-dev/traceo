import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '../../lib/types/dto/response.dto';
import { AccountDto, CreateAccountDto } from '../../lib/types/dto/account.dto';
import { IAccount, RequestUser } from '../../lib/types/interfaces/account.interface';
import { BaseDtoQuery } from '../core/query/generic.model';
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { AccountPermissionService } from './account-permission/account-permission.service';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    readonly accountService: AccountService,
    readonly accountQueryService: AccountQueryService,
    readonly permission: AccountPermissionService
  ) { }

  @Get()
  @AuthRequired()
  async getApplication(@Query("id") id: string): Promise<ApiResponse<IAccount>> {
    return await this.accountQueryService.getApiDto(id);
  }

  @Get('/all')
  @AuthRequired()
  async getAccounts(@Query() query: BaseDtoQuery): Promise<ApiResponse<IAccount[]>> {
    return await this.accountQueryService.getApiListDto(query);
  }

  @Post('/new')
  @AuthRequired()
  async createAccount(
    @Body() accountDto: CreateAccountDto,
    @AuthAccount() account: RequestUser
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('CREATE_ACCOUNT', account);

    return this.accountService.createAccount(accountDto);
  }

  @Patch()
  @AuthRequired()
  async updateAccount(
    @Body() accountDto: AccountDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    return await this.accountService.updateAccountApi(account.id, accountDto);
  }

  @Delete('/:id')
  @AuthRequired()
  public async deleteAccount(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE ACCOUNT', account);

    return await this.accountService.deleteAccount(id, account);
  }
}
