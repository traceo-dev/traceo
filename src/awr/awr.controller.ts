import { Body, Controller, Delete, Get, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { Account } from 'src/db/entities/account.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { AwrQueryService } from './awr-query/awr-query.service';
import { AddAccountToWorkspaceModel, AwrModel, WorkspaceDtoQuery } from './awr.model';
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
    public async getWorkspaceMembers(
        @Query("id", new ParseUUIDPipe()) id: string,
        @Query() query: BaseDtoQuery
    ): Promise<AccountWorkspaceRelationship[]> {
        return await this.awrQueryService.getWorkspaceMembers(id, query);
    }

    @Get('/workspaces')
    @AuthRequired()
    public async getAccountWorkspaces(
        @Query() pageOptionsDto: WorkspaceDtoQuery,
        @AuthAccount() account: RequestUser
    ): Promise<AccountWorkspaceRelationship[]> {
        return await this.awrQueryService.getWorkspacesForAccount(account?.id, pageOptionsDto);
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

    @Delete('/workspace/leave')
    @AuthRequired()
    public async leaveWorkspace(
        @Query("aid", new ParseUUIDPipe()) aid: string,
        @Query("wid", new ParseUUIDPipe()) wid: string,
    ): Promise<void> {
        return await this.awrService.leaveWorkspace(aid, wid);
    }
}
