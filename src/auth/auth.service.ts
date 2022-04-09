import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { CreateAccountDto } from 'src/account/account.model';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/db/entities/account.entity';
import { AccountCredentialsDto, RequestUser, UpdatePasswordDto } from './auth.model';
import { JwtPayload } from './jwt.payload.interface';
import { JwtService } from "@nestjs/jwt"
import { EntityManager } from 'typeorm';
import { AccountNotExistsError, BadPasswordOrNotExists } from 'src/utils/errors';

@Injectable()
export class AuthService {
    constructor(
        private readonly accountService: AccountService,
        private readonly jwtService: JwtService,
        private readonly entityManager: EntityManager
    ) { }

    public async login(
        accountCredentials: AccountCredentialsDto
    ): Promise<any | { status: number }> {
        await this.validate(accountCredentials);

        const user = await this.accountService.getAccountByEmail(accountCredentials.email);
        const payload: JwtPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        const { accessToken } = await this.createToken(payload);

        return {
            accessToken
        };
    }

    public async register(accountDto: CreateAccountDto): Promise<any> {
        return this.accountService.createAccount(accountDto);
    }

    async checkUserPassword(credentials: AccountCredentialsDto): Promise<void> {
        const { email, password } = credentials;
        await Account.findOneOrFail({
            where: {
                email,
                password: createHmac('sha256', password).digest('hex'),
            }
        }).catch(() => {
            throw new BadPasswordOrNotExists();
        });
    }

    public async updateUserPassword(
        currentUser: RequestUser,
        passwords: UpdatePasswordDto,
    ): Promise<any> {
        const { id } = currentUser;
        const { newPassword, password } = passwords;

        try {
            await this.entityManager.transaction(async (transaction) => {
                const account = await transaction.getRepository(Account).findOneByOrFail({ _id: id });

                if (!account) {
                    throw new AccountNotExistsError();
                }

                const credentials = new AccountCredentialsDto(
                    account?.email,
                    password,
                );

                await this.checkUserPassword(credentials)
                    .then(async () => {
                        account.password = createHmac('sha256', newPassword).digest('hex')
                        await transaction.getRepository(Account).save(account);
                    }).catch(() => {
                        throw new BadPasswordOrNotExists();
                    });

                return {
                    status: 200,
                    data: "Password updated!"
                }
            });
        } catch (error) {
            return {
                status: 400,
                data: "Error during updating account password."
            }
        }
    }

    public async createToken(payload: JwtPayload): Promise<{ accessToken: string }> {
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }

    private async validate(userData: AccountCredentialsDto): Promise<void> {
        const user = await this.accountService.getAccountByEmail(userData.email);
        if (user) {
            await this.checkUserPassword(userData);
        } else {
            throw new AccountNotExistsError();
        }
    }
}