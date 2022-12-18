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
import { BaseDtoQuery } from '../../common/base/query/base-query.model';
import { GuardsService } from '../../common/guards/guards.service';
import { AuthRequired } from '../../common/decorators/auth-required.decorator';
import { AuthAccount } from '../../common/decorators/auth-user.decorator';
import { CreateAccountDto, AccountDto } from '../../common/types/dto/account.dto';
import { ApiResponse } from '../../common/types/dto/response.dto';
import { IAccount, RequestUser } from '../../common/types/interfaces/account.interface';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountService } from './account.service';

@ApiTags('account')
@Controller('account')
export class AccountController {
  constructor(
    readonly accountService: AccountService,
    readonly accountQueryService: AccountQueryService,
    readonly permission: GuardsService
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
