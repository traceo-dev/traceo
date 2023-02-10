import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuardsService } from '@common/guards/guards.service';
import { AuthAccount } from '@common/decorators/auth-user.decorator';
import { CreateAccountDto, AccountDto } from '@common/types/dto/account.dto';
import { ApiResponse } from '@common/types/dto/response.dto';
import { IUser, RequestUser } from '@traceo/types';
import { AccountQueryService } from './account-query/account-query.service';
import { AccountService } from './account.service';
import { AuthGuard } from '@common/decorators/auth-guard.decorator';

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
  async getSignedInAccount(): Promise<ApiResponse<IUser>> {
    return await this.accountQueryService.getSignedInAccount();
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
  async updateAccount(@Body() accountDto: AccountDto): Promise<ApiResponse<unknown>> {
    return await this.accountService.updateAccountApi(accountDto);
  }

  @Delete('/:id')
  public async deleteAccount(
    @Param("id") id: string,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    await this.permission.can('DELETE ACCOUNT', account);

    return await this.accountService.deleteAccount(id);
  }
}
