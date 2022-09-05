import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Account, AccountRole } from 'src/db/entities/account.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { AccountAlreadyExistsError, InternalServerError } from 'src/helpers/errors';
import tokenService from 'src/helpers/tokens';
import { EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AccountDto, CreateAccountDto } from './account.model';
import { AccountQueryService } from './account-query/account-query.service';
import { AmrService } from 'src/application-member/amr.service';
import { ApplicationQueryService } from 'src/application/application-query/application-query.service';
import { AccountMemberRelationship, MEMBER_STATUS } from 'src/db/entities/account-member-relationship.entity';
import { HttpService } from "@nestjs/axios";
import { RequestUser } from 'src/auth/auth.model';

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

    public async createAccount(accountDto: CreateAccountDto): Promise<any> {
        const { name, email, password, appId } = accountDto;

        const account = await this.accountQueryService.getAccountByEmail(email);
        if (account) {
            throw new AccountAlreadyExistsError();
        }

        try {
            const account: QueryDeepPartialEntity<Account> = {
                email,
                name,
                password: tokenService.generate(password),
                role: AccountRole.GUEST,
                active: false,
                activateHash: randomUUID(),
            };

            await this.entityManager
                .getRepository(Account)
                .insert({ ...account });

            const confirmUrl = this.getConfirmUrl(appId, String(account?.activateHash));

            await this.mailingService.sendSignUpConfirmation(email, confirmUrl);
        } catch (error) {
            Logger.error(`[${this.createAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    private getConfirmUrl(applicationId: string, activateHash: string) {
        const appOrigin = process.env.APP_ORIGIN;
        return applicationId
            ? `${appOrigin}/confirm?ac=${activateHash}&w=${applicationId}`
            : `${appOrigin}/confirm?ac=${activateHash}`;
    }

    public async confirmAccount(hash: string, applicationId?: number): Promise<void> {
        try {
            await this.entityManager.transaction(async (manager) => {
                const accountRepository = manager.getRepository(Account);

                const account = await accountRepository.findOne({
                    where: {
                        activateHash: hash,
                        active: false
                    }
                });

                if (!account) {
                    return;
                }

                await accountRepository.update(
                    { id: account?.id },
                    { activateHash: null, active: true }
                );

                if (applicationId) {
                    const application = await this.applicationQueryService.getDto(applicationId);
                    await this.awrService.createAwr(
                        account,
                        application,
                        MEMBER_STATUS.DEVELOPER,
                        manager);
                }
            });
        } catch (error) {
            Logger.error(`[${this.confirmAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    public async updateAccount(accountDto: AccountDto): Promise<void> {
        const { id, ...rest } = accountDto;
        try {
            await this.entityManager.getRepository(Account).update({ id }, rest);
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
                    status: MEMBER_STATUS.OWNER
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
