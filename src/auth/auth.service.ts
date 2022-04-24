import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { CreateAccountDto } from 'src/account/account.model';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/db/entities/account.entity';
import { AccountCredentialsDto, RequestUser, UpdatePasswordDto } from './auth.model';
import { JwtPayload } from './jwt.payload.interface';
import { JwtService } from "@nestjs/jwt"
import { EntityManager } from 'typeorm';
import { AccountNotExistsError, BadPasswordOrNotExists } from 'src/helpers/errors';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService,
        private readonly entityManager: EntityManager
    ) { }

    public async login(
        accountCredentials: AccountCredentialsDto
    ): Promise<{ accessToken: string }> {
        return await this.entityManager.transaction(async (manager) => {

            const { isCorrect, account } = await this.checkUserPassword(accountCredentials, manager);
            if (!isCorrect) {
                throw new BadPasswordOrNotExists();
            }

            const { _id, name, email, logo } = account;
            const payload: JwtPayload = {
                id: _id,
                name,
                email,
                logo
            };
            const { accessToken } = await this.createToken(payload);

            return {
                accessToken
            };
        });
    }

    public async register(accountDto: CreateAccountDto): Promise<any> {
        return this.accountService.createAccount(accountDto);
    }

    async checkUserPassword(credentials: AccountCredentialsDto, manager: EntityManager = this.entityManager): Promise<{ isCorrect: boolean, account?: Account }> {
        const { email, password } = credentials;
        const account = await manager.getRepository(Account).findOne({
            where: {
                email,
                password: createHmac('sha256', password).digest('hex'),
            }
        });

        if (!account) {
            return {
                isCorrect: false
            };
        }

        return {
            isCorrect: true,
            account
        };
    }

    public async updateUserPassword(
        currentUser: RequestUser,
        passwords: UpdatePasswordDto,
    ): Promise<any> {
        const { id } = currentUser;
        const { newPassword, password } = passwords;

        await this.entityManager.transaction(async (manager) => {
            const account = await manager.getRepository(Account).findOneByOrFail({ _id: id });

            if (!account) {
                throw new AccountNotExistsError();
            }

            const credentials = new AccountCredentialsDto(
                account?.email,
                password,
            );

            const correctPassword = await this.checkUserPassword(credentials, manager);
            if (!correctPassword) {
                throw new BadPasswordOrNotExists();
            }

            account.password = createHmac('sha256', newPassword).digest('hex')
            await manager.getRepository(Account).save(account);

            return {
                status: 200,
                data: "Password updated!"
            }
        });
    }

    public async createToken(payload: JwtPayload): Promise<{ accessToken: string }> {
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}