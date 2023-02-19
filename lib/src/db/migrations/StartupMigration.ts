import { ADMIN_EMAIL } from "../../common/helpers/constants";
import dateUtils from "../../common/helpers/dateUtils";
import { gravatar } from "../../common/helpers/gravatar";
import tokenService from "../../common/helpers/tokens";
import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/user.entity";
import { UserStatus } from "@traceo/types"

export class StartupMigration implements MigrationInterface {
    name?: string;

    constructor() {
        this.name = `StartupMigration${Date.now()}`
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        const connection = queryRunner.connection;

        try {
            await connection.synchronize();

            const user = await connection.getRepository(User).findOneBy({ email: ADMIN_EMAIL });
            if (!user) {
                const password = tokenService.generate("admin");
                const url = gravatar.url("admin", "retro");
                const user: Partial<User> = {
                    email: ADMIN_EMAIL,
                    name: "admin",
                    username: "admin",
                    isAdmin: true,
                    gravatar: url,
                    password,
                    isPasswordUpdated: false,
                    createdAt: dateUtils.toUnix(),
                    status: UserStatus.ACTIVE
                }
                await connection.getRepository(User).insert(user);
                console.log(`[Traceo] Migration run successfully. Admin user created.`);
            }
        } catch (err) {
            console.error(`[Traceo] Cannot run migration. Admin user not created. Caused by: ${err}`);
        }
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        throw new Error("Method not implemented.");
    }
}