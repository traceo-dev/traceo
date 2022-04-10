import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Account, ROLE } from 'src/db/entities/account.entity';
import { MailingService } from 'src/mailing/mailing.service';
import dateUtils from 'src/helpers/dateUtils';
import { AccountAlreadyExistsError, InternalServerError } from 'src/helpers/errors';
import tokenService from 'src/helpers/tokens';
import { EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AccountDto, CreateAccountDto } from './account.model';

@Injectable()
export class AccountService {
    constructor(
        readonly mailingService: MailingService,
        readonly entityManager: EntityManager,
    ) { }

    public async createAccount(accountDto: CreateAccountDto): Promise<any> {
        const { name, email, password, wid } = accountDto;

        const account = await this.getAccountByEmail(email);
        if (account) {
            throw new AccountAlreadyExistsError();
        }

        try {
            const account: QueryDeepPartialEntity<Account> = {
                email,
                name,
                password: tokenService.generate(password),
                role: ROLE.GUEST,
                createdAt: dateUtils.toUnix(),
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

    public async getAccountById(id: string): Promise<Account | null> {
        return this.entityManager.getRepository(Account).findOneBy({ _id: id })
    }

    public async getAccountByEmail(email: string): Promise<Account | null> {
        return this.entityManager.getRepository(Account).findOneBy({ email })
    }

    public async confirmAccount(hash: string, workspaceId?: string): Promise<void> {
        try {
            await this.entityManager.transaction(async (transaction) => {
                const accountRepository = transaction.getRepository(Account);

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
                    { _id: account?._id },
                    { activateHash: null, active: true }
                );

                if (workspaceId) {
                    // await workspaceService.addMemberToWorkspace(
                    //     transactionManager,
                    //     account?._id as string,
                    //     wid as string
                    // );
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
            await this.entityManager.getRepository(Account).update({ _id: id }, rest);
        } catch (error) {
            Logger.error(`[${this.updateAccount.name}] Caused by: ${error}`)
            throw new InternalServerError();
        }
    }
}
