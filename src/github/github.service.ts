import { Injectable } from '@nestjs/common';
import { AxiosRequestHeaders } from 'axios';
import { Octokit } from 'octokit';
import { firstValueFrom } from 'rxjs';
import { RequestUser } from 'src/auth/auth.model';
import { Github } from 'src/db/entities/github.entity';
import { GithubRepository } from 'src/db/models/github';
import dateUtils from 'src/helpers/dateUtils';
import { EntityManager } from 'typeorm';
import { HttpService } from "@nestjs/axios";
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { Account } from 'src/db/entities/account.entity';

@Injectable()
export class GithubService {
    constructor (
        readonly entityManager: EntityManager,
        readonly httpService: HttpService,
        readonly accountQueryService: AccountQueryService,
    ) {}
    
    public async handleGithubAuth(code: string, account: RequestUser): Promise<{ connected: boolean }> {
        const { id } = account;

        const GH_CLIENT_ID = process.env.GH_CLIENT_ID;
        const GH_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;

        if (!GH_CLIENT_ID || !GH_CLIENT_SECRET) {
            throw new Error("Github client ID and client secret are required!");
        }

        try {
            const headers: AxiosRequestHeaders = {
                Accept: 'application/json',
            };

            const payload = {
                client_id: GH_CLIENT_ID,
                client_secret: GH_CLIENT_SECRET,
                code
            }

            // Converts an observable to a promise by subscribing to the observable,
            const response = await firstValueFrom(this.httpService.post('https://github.com/login/oauth/access_token', payload, {
                headers
            }));

            const { status, data } = response;
            const { access_token } = data;

            if (status === 200 && data.access_token) {

                const octokit = new Octokit({ auth: access_token });

                const githubUser = await octokit.rest.users.getAuthenticated();
                const { login, name, avatar_url, html_url } = githubUser.data;

                const account = await this.accountQueryService.getDto(id);
                await this.entityManager.getRepository(Account).save({
                    ...account,
                    github: {
                        accessToken: access_token,
                        login,
                        name,
                        profileUrl: html_url,
                        avatar: avatar_url,
                        createdAt: dateUtils.toUnix()
                    }
                });
            }

            return {
                connected: true
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async removeGithubAuth(user: RequestUser): Promise<void> {
        this.entityManager.transaction(async (manager) => {
            const account = await this.getAccountWithGithub(user.id, manager);

            await manager.getRepository(Account).update({ id: account.id }, {
                github: null
            });

            await manager.getRepository(Github).delete({ id: account?.github?.id });
        });
    }

    async getGithubRepositories(search: string, user: RequestUser): Promise<any> {
        const account = await this.getAccountWithGithub(user.id);
        const { github } = account;

        if (!github) {
            throw new Error('Github authentication is required!');
        }

        try {
            const octokit = new Octokit({
                auth: github.accessToken
            });

            // TODO: find api call in GITHUB SEARCH API to fetching repo name via q=search instead of fetching all results
            const repos = await octokit.request('GET /user/repos');

            if (!repos.data) {
                return [];
            }

            const repositories = repos.data
                .filter((repo) => repo.name.toLowerCase()
                    .startsWith(search?.toLowerCase() || ""))
                .map((repo) => {
                    return {
                        full_name: repo.full_name,
                        html_url: repo.html_url,
                        name: repo.name
                    } as GithubRepository
                });

            return repositories;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAccountWithGithub(id: string, manager: EntityManager = this.entityManager): Promise<Account> {
        return await manager.getRepository(Account).findOne({
            where: { id },
            relations: {
                github: true
            }
        });
    }
}
