import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { GithubRepository } from 'src/db/models/github';
import { AuthRequired } from 'src/libs/decorators/auth-required.decorator';
import { AuthAccount } from 'src/libs/decorators/auth-user.decorator';
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
    ): Promise<GithubRepository[]> {
        return await this.githubService.getGithubRepositories(search, account);
    }

    @Post("/connect")
    @AuthRequired()
    async connectGithubRepository(
        @Body() body: { name: string, id: number },
        @AuthAccount() account: RequestUser
    ): Promise<any> {
        return await this.githubService.connectGithubRepository(body, account);
    }

    @Delete("/disconnect")
    @AuthRequired()
    async disconnectGithubRepository(
        @Query('id') id: number,
    ): Promise<any> {
        return await this.githubService.disconnectGithubRepository(id);
    }

    @Post("/create/issue")
    @AuthRequired()
    async createGithubIssue(
        @Body() body: { id: string },
    ): Promise<any> {
        return await this.githubService.createGithubIssue(body.id);
    }
}
