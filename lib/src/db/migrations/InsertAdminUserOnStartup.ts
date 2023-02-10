import { ADMIN_EMAIL } from "../../common/helpers/constants";
import dateUtils from "../../common/helpers/dateUtils";
import { gravatar } from "../../common/helpers/gravatar";
import tokenService from "../../common/helpers/tokens";
import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/user.entity";
import { UserStatus } from "@traceo/types"

export class InsertAdminUserOnStartup implements MigrationInterface {
    name?: string;

    constructor() {
        this.name = `InsertAdminUserOnStartup${Date.now()}`
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        const connection = queryRunner.connection;

        await connection.synchronize();

        const user = await connection.getRepository(User).findOneBy({ email: ADMIN_EMAIL });
        if (!user) {
            const password = tokenService.generate("admin");
            const url = gravatar.url("admin", "retro");
            await connection.getRepository(User).insert({
                email: ADMIN_EMAIL,
                name: "admin",
                username: "admin",
                isAdmin: true,
                gravatar: url,
                password,
                isPasswordUpdated: false,
                createdAt: dateUtils.toUnix(),
                status: UserStatus.ACTIVE
            });
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
}