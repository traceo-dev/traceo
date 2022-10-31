import dateUtils from "../../helpers/dateUtils";
import tokenService from "../../helpers/tokens";
import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { Account, AccountStatus } from "../entities/account.entity";
import { ADMIN_EMAIL } from "../../helpers/constants";

export class InsertAdminUserOnStartup implements MigrationInterface {
    name?: string;

    constructor() {
        this.name = `InsertAdminUserOnStartup${Date.now()}`
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        const connection = queryRunner.connection;

        await connection.synchronize();

        const account = await connection.getRepository(Account).findOneBy({ email: ADMIN_EMAIL });
        if (!account) {
            const password = tokenService.generate("admin");
            await connection.getRepository(Account).insert({
                email: ADMIN_EMAIL,
                name: "admin",
                username: "admin",
                isAdmin: true,
                password,
                isPasswordUpdated: false,
                createdAt: dateUtils.toUnix(),
                status: AccountStatus.ACTIVE
            });
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
}