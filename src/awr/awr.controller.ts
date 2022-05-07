import { Body, Controller, Delete, Get, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { PageableDto, PageOptionsDto } from 'src/core/core.model';
import { AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { AwrQueryService } from './awr-query/awr-query.service';
import { AddAccountToWorkspaceModel, AwrModel } from './awr.model';
import { AwrService } from './awr.service';

@ApiTags('account-workspace-relationship')
@Controller('awr')
export class AwrController {
    constructor(
        private readonly awrService: AwrService,
        private readonly awrQueryService: AwrQueryService
    ) {}

    @Get('/account')
    @AuthRequired()
    async getAccountById(
        @Query('id') id: string,
        @Query('wid') wid: string,
    ): Promise<Account | AccountWorkspaceRelationship> {
        return await this.awrQueryService.getAccount(id, wid);
    }

    // @Get('/member')
    // @AuthRequired()
    // public async getWorkspaceMember(
    //     @Query("id", new ParseUUIDPipe()) id: string
    // ): Promise<AccountWorkspaceRelationship | null> {
    //     return await this.awrQueryService.getWorkspaceMember(id)
    // }

    @Get('/members')
    @AuthRequired()
    @ApiPaginatedResponse(AccountWorkspaceRelationship)
    public async getWorkspaceMembers(
        @Query("id", new ParseUUIDPipe()) id: string,
        @Query() pageOptionsDto: PageOptionsDto
    ): Promise<PageableDto<AccountWorkspaceRelationship>> {
        return await this.awrQueryService.getWorkspaceMembers(id, pageOptionsDto);
    }

    @Get('/workspaces')
    @AuthRequired()
    @ApiPaginatedResponse(AccountWorkspaceRelationship)
    public async getAccountWorkspaces(
        @Query() pageOptionsDto: PageOptionsDto,
        @AuthAccount() account: RequestUser
    ): Promise<PageableDto<AccountWorkspaceRelationship>> {
        return await this.awrQueryService.getAccountWorkspaces(account?.id, pageOptionsDto);
    }

    @Post('/workspace/add')
    @AuthRequired()
    public async addAccountToWorkspace(
        @Body() body: AddAccountToWorkspaceModel
    ): Promise<void> {
        const { email, workspaceId } = body;
        return await this.awrService.addAccountToWorkspace(email, workspaceId);
    }

    @Get('/workspace/assign')
    // @AuthRequired()
    public async assignAccountToWorkspace(
        @Query("wid") workspaceId: string,
        @Query("aid") accountId: string
    ): Promise<void> {
        return await this.awrService.assignAccountToWorkspace(accountId, workspaceId);
    }

    @Patch('/workspace/member')
    @AuthRequired()
    public async updateWorkspaceAccount(
        @Body() body: AwrModel
    ): Promise<void> {
        return await this.awrService.updateWorkspaceAccount(body);
    }

    @Delete('/workspace/member')
    @AuthRequired()
    public async removeAccountFromWorkspace(
        @Query("id", new ParseUUIDPipe()) id: string,
    ): Promise<void> {
        return await this.awrService.removeAccountFromWorkspace(id);
    }
}
