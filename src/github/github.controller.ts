import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { GithubService } from './github.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
    constructor(
        readonly githubService: GithubService
    ) { }

  
    @Get("/auth")
    @AuthRequired()
    async githubCallback(
        @Query('code') code: string,
        @AuthAccount() account: RequestUser
    ): Promise<{ connected: boolean }> {
        return await this.githubService.handleGithubAuth(code, account);
    }

    @Delete()
    @AuthRequired()
    async removeGithubAuth(
        @AuthAccount() account: RequestUser
    ): Promise<void> {
        return await this.githubService.removeGithubAuth(account);
    }

    @Get("/repos")
    @AuthRequired()
    async githubRepositories(
        @Query('search') search: string,
        @AuthAccount() account: RequestUser
    ): Promise<any> {
        return await this.githubService.getGithubRepositories(search, account);
    }
}
