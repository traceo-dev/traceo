import { Injectable, Logger } from '@nestjs/common';
import { Account, AccountStatus } from 'src/db/entities/account.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { AccountEmailAlreadyExistsError, AccountUsernameEmailAlreadyExistsError, InternalServerError } from 'src/helpers/errors';
import tokenService from 'src/helpers/tokens';
import { EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AccountDto, CreateAccountDto } from './account.model';
import { AccountQueryService } from './account-query/account-query.service';
import { AmrService } from 'src/application-member/amr.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountMemberRelationship, MemberRole } from 'src/db/entities/account-member-relationship.entity';
import { HttpService } from "@nestjs/axios";
import { RequestUser } from 'src/auth/auth.model';
import dateUtils from 'src/helpers/dateUtils';
import * as gravatar from "gravatar";

@Injectable()
export class AccountService {
    constructor(
        readonly mailingService: MailingService,
        readonly entityManager: EntityManager,
        readonly accountQueryService: AccountQueryService,
        readonly applicationQueryService: ApplicationQueryService,
        readonly awrService: AmrService,
        readonly httpService: HttpService
    ) { }

    private async checkDuplicate(username: string, email: string) {
        const account = await this.accountQueryService.getAccountByUsername(username.toLowerCase());
        if (account) {
            throw new AccountUsernameEmailAlreadyExistsError();
        }

        if (email) {
            const account = await this.accountQueryService.getAccountByEmail(email);
            if (account) {
                throw new AccountEmailAlreadyExistsError();
            }
        }
    }

    public async createAccount(accountDto: CreateAccountDto): Promise<any> {
        const { name, email, password, username } = accountDto;

        await this.checkDuplicate(username, email);

        try {
            const url = this.getGravatarUrl(email, username);
            const account: QueryDeepPartialEntity<Account> = {
                email,
                name,
                username: username.toLowerCase(),
                password: tokenService.generate(password),
                isAdmin: false,
                gravatar: url,
                status: AccountStatus.INACTIVE,
                createdAt: dateUtils.toUnix()
            };

            await this.entityManager
                .getRepository(Account)
                .insert({ ...account });
        } catch (error) {
            Logger.error(`[${this.createAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    private getGravatarUrl(email: string, username: string): string {
        return gravatar.url(email || username, { s: '100', r: 'x', d: 'retro', f: "y" }, false);
    }

    public async updateAccount(accountId: string, accountDto: AccountDto): Promise<void> {
        const { id, ...rest } = accountDto;
        try {
            // first we update user based on id from DTO, if this id is null then we use current accountId from request, 
            // maybe we should not do this in this way...
            await this.entityManager.getRepository(Account).update({ id: id || accountId }, rest);
        } catch (error) {
            Logger.error(`[${this.updateAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    public async deleteAccount(user: RequestUser): Promise<any> {
        const { id } = user;

        await this.entityManager.transaction(async (manager) => {
            const awrWithOwnerStatus = await manager.getRepository(AccountMemberRelationship).find({
                where: {
                    account: {
                        id
                    },
                    role: MemberRole.ADMINISTRATOR
                }
            });

            if (awrWithOwnerStatus.length > 0) {
                throw new Error('You cannot delete your account for having owner status in one or more apps. Please delete the application or change the status.')
            }

            await manager.getRepository(Account)
                .createQueryBuilder('account')
                .where('account.id = :id', { id })
                .delete()
                .execute();
        });
    }
}
