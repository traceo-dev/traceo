import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { Workspace } from 'src/db/entities/workspace.entity';
import { WorkspaceResponse } from 'src/db/models/workspace';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { WorkspaceQueryService } from './workspace-query/workspace-query.service';
import { CreateWorkspaceModel, WorkspaceModel } from './workspace.model';
import { WorkspaceService } from './workspace.service';

@ApiTags('workspace')
@Controller('workspace')
export class WorkspaceController {
    constructor(
        readonly workspaceService: WorkspaceService,
        readonly workspaceQueryService: WorkspaceQueryService
    ) {}

    @Get()
    async getWorkspace(
        @Query('id') id: string,
    ): Promise<WorkspaceResponse | null> {
        return await this.workspaceQueryService.getWorkspace(id);
    }

    @Post()
    @AuthRequired()
    async createWorkspace(
        @Body() body: CreateWorkspaceModel,
        @AuthAccount() account: RequestUser
    ): Promise<Workspace> {
        return await this.workspaceService.createWorkspace({ name: body?.name }, account)
    }

    @Patch()
    @AuthRequired()
    async updateWorkspace(
        @Body() workspace: WorkspaceModel,
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.workspaceService.updateWorkspace(workspace, account);
    }
}
