import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountClusterRelationship } from 'src/db/entities/account-cluster-relationship.entity';
import { Cluster } from 'src/db/entities/cluster.entity';
import { Workspace } from 'src/db/entities/workspace.entity';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
import { ClusterQueryService } from './cluster-query/cluster-query.service';
import { CreateClusterModel } from './cluster.model';
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
}
