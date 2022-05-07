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
import { AwrService } from 'src/awr/awr.service';
import { WorkspaceQueryService } from 'src/workspace/workspace-query/workspace-query.service';
import { MEMBER_STATUS } from 'src/db/entities/account-workspace-relationship.entity';
import { getKeyFromBucketUrl } from 'src/helpers/base';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { AttachmentType } from 'src/db/entities/attachment.entity';

@Injectable()
export class AccountService {
    constructor(
        readonly mailingService: MailingService,
        readonly entityManager: EntityManager,
        readonly accountQueryService: AccountQueryService,
        readonly workspaceQueryService: WorkspaceQueryService,
        readonly awrService: AwrService,
        readonly awsBucketService: AWSBucketService
    ) { }

    public async createAccount(accountDto: CreateAccountDto): Promise<any> {
        const { name, email, password, wid } = accountDto;

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

            const confirmUrl = this.getConfirmUrl(wid, String(account?.activateHash));
            
            await this.mailingService.sendSignUpConfirmation(email, confirmUrl);
        } catch (error) {
            Logger.error(`[${this.createAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    private getConfirmUrl(workspaceId: string, activateHash: string) {
        const appOrigin = process.env.APP_ORIGIN;
        return workspaceId
            ? `${appOrigin}/confirm?ac=${activateHash}&w=${workspaceId}`
            : `${appOrigin}/confirm?ac=${activateHash}`;
    }

    public async confirmAccount(hash: string, workspaceId?: string): Promise<void> {
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

                if (workspaceId) {
                    const workspace = await this.workspaceQueryService.getWorkspaceById(workspaceId, manager);
                    await this.awrService.createAwr({
                        account,
                        workspace,
                        memberStatus: MEMBER_STATUS.DEVELOPER
                    }, manager);
                }
            });
        } catch (error) {
            Logger.error(`[${this.confirmAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }

    public async updateAccount(accountDto: AccountDto): Promise<void> {
        const { id, ...rest } = accountDto;
        const { logo } = rest;
        try {
            const account = await this.accountQueryService.getAccountById(id);
            if (logo && account?.logo) {
                const keyName = `${AttachmentType.ACCOUNT_AVATAR}/${getKeyFromBucketUrl(account?.logo)}`;
                await this.awsBucketService.removeFileFromBucket(keyName);
            }
            await this.entityManager.getRepository(Account).update({ id }, rest);
        } catch (error) {
            Logger.error(`[${this.updateAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }
}
