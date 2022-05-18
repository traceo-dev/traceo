import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { BaseDtoQuery } from 'src/core/generic.model';
import { AccountClusterRelationship } from 'src/db/entities/account-cluster-relationship.entity';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { AcrQueryService } from './acr-query/acr-quer.service';

@ApiTags('acr')
@Controller('acr')
export class AcrController {
    constructor (
        readonly acrQueryService: AcrQueryService
    ) {}

    @Get('/clusters')
    @AuthRequired()
    public async getAccountWorkspaces(
        @Query() query: BaseDtoQuery,
        @AuthAccount() account: RequestUser
    ): Promise<AccountClusterRelationship[]> {
        return await this.acrQueryService.getClustersForAccount(account.id, query);
    }
}
