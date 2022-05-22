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
import { Workspace } from 'src/db/entities/workspace.entity';
import { Incident } from 'src/db/entities/incident.entity';

@Injectable()
export class GithubService {
    constructor(
        readonly entityManager: EntityManager,
        readonly httpService: HttpService,
        readonly accountQueryService: AccountQueryService,
    ) { }

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

    async getGithubRepositories(search: string, user: RequestUser): Promise<GithubRepository[]> {
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
                        id: repo.id,
                        full_name: repo.full_name,
                        html_url: repo.html_url,
                        name: repo.name,
                    } as unknown as GithubRepository
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

    async disconnectGithubRepository(id: string): Promise<void> {
        console.log("ID: ", id)
        await this.entityManager.getRepository(Workspace).update({ id }, {
            github: null
        });
    }

    async connectGithubRepository(body: { name: string, id: string }, user: RequestUser): Promise<void> {
        const account = await this.getAccountWithGithub(user.id);
        const { github } = account;

        const { name, id } = body;

        if (!github) {
            throw new Error('Github authentication is required!');
        }

        try {
            const octokit = new Octokit({
                auth: github.accessToken
            });

            const repository = await octokit.rest.repos.get({
                owner: github.login,
                repo: name
            });

            const { name: repoName, full_name, html_url } = repository.data;

            await this.entityManager.getRepository(Workspace).update({ id }, {
                github: {
                    user_id: user.id,
                    full_name,
                    html_url,
                    name: repoName
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    async createGithubIssue(incidentId: string): Promise<void> {
        if (!incidentId) {
            throw new Error('Incident id is required!');
        }

        const incident = await this.entityManager.getRepository(Incident).findOne({
            where: {
                id: incidentId
            },
            relations: ['workspace']
        });

        if (!incident.workspace?.github) {
            throw new Error('Github repository connection is required!');
        }

        const { user_id, full_name } = incident.workspace.github;

        const account = await this.entityManager.getRepository(Account).findOne({
            where: {
                id: user_id
            },
            relations: ['github']
        });

        if (!account?.github.accessToken) {
            throw new Error('Github access token is required!')
        }

        const octokit = new Octokit({
            auth: account.github.accessToken
        });

        const [owner, repo] = full_name.split("/");

        const { type, message, stack, release, platform } = incident;
        const { data } = await octokit.rest.issues.create({
            owner,
            repo,
            title: `${type}: ${message}`,
            body: `## Details\n\n\n#### Type: ${type}\n#### Message: ${message}\n#### Version: ${release}\n\n#### Platform:\n- System: ${platform.version}\n- Platform: ${platform.platform}\n- Release: ${platform.release}\n- Arch: ${platform.arch}\n\n#### Incident Stack Trace:\n\n<pre>${stack}</pre>\n\n\nIssue created with Klepper.IO`,
            labels: ['bug']
        });

        await this.entityManager.getRepository(Incident).save({
            ...incident,
            githubIssueUrl: data.html_url
        });
    }
}
