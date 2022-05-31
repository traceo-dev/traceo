import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountClusterRelationship } from 'src/db/entities/account-cluster-relationship.entity';
import { AccountWorkspaceRelationship } from 'src/db/entities/account-workspace-relationship.entity';
import { Cluster } from 'src/db/entities/cluster.entity';
import { Workspace } from 'src/db/entities/workspace.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { ClusterQueryService } from './cluster-query/cluster-query.service';
import { WorkspaceToCluster, CreateClusterModel } from './cluster.model';
import { ClusterService } from './cluster.service';

@ApiTags('cluster')
@Controller('cluster')
export class ClusterController {
    constructor(
        readonly clusterService: ClusterService,
        readonly clusterQueryService: ClusterQueryService,
    ) {}

    @Get("/workspaces")
    async getClusterWorkspaces(
        @Query('id') id: string,
    ): Promise<Workspace[]> {
        return await this.clusterQueryService.getWorkspacesForCluster(id);
    }

    @Post()
    @AuthRequired()
    async createCluster(
        @Body() body: CreateClusterModel,
        @AuthAccount() account: RequestUser
    ): Promise<Cluster> {
        return await this.clusterService.createCluster(body, account)
    }

    @Get('/clusters')
    @AuthRequired()
    public async getClustersForAccount(
        @Query() query: BaseDtoQuery,
        @AuthAccount() account: RequestUser
    ): Promise<AccountClusterRelationship[]> {
        return await this.clusterQueryService.getClustersForAccount(account.id, query);
    }

    @Get('/free/workspaces')
    @AuthRequired()
    public async getWorkspacesWithoutCluster(
        @AuthAccount() account: RequestUser
    ): Promise<AccountWorkspaceRelationship[]> {
        return await this.clusterQueryService.getWorkspacesWithoutCluster(account);
    }


    @Post('/add/workspace')
    @AuthRequired()
    public async addWorkspaceToCluster(
        @Body() body: WorkspaceToCluster
    ): Promise<void> {
        const { clusterId, workspaceId } = body;
        return await this.clusterService.addWorkspaceToCluster(workspaceId, clusterId);
    }

    @Patch('/remove/workspace')
    @AuthRequired()
    public async removeWorkspaceFromCluster(
        @Body() body: WorkspaceToCluster
    ): Promise<void> {
        console.log("B: ", body)
        const { clusterId, workspaceId } = body;
        return await this.clusterService.removeWorkspaceFromCluster(workspaceId, clusterId);
    }
}
