import { ADMIN_EMAIL } from "../../common/helpers/constants";
import dateUtils from "../../common/helpers/dateUtils";
import { gravatar } from "../../common/helpers/gravatar";
import tokenService from "../../common/helpers/tokens";
import { User } from "../entities/user.entity";
import { UserStatus } from "@traceo/types";
import { MigrationInterface, QueryRunner } from "typeorm";
import { Logger } from "@nestjs/common";

export class PostgresMigration implements MigrationInterface {
  name?: string;
  private readonly logger: Logger;

  constructor() {
    this.name = `StartupMigration${Date.now()}`;
    this.logger = new Logger(PostgresMigration.name);
  }

  async up(queryRunner: QueryRunner): Promise<any> {
    const connection = queryRunner.connection;

    await connection.synchronize();

    /**
     * If there is not user then we have to configure everything like:
     * 
     * 1. Create admin user with admin/admin
     */

    await connection.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOneBy({ email: ADMIN_EMAIL });
      if (!user) {
        const now = dateUtils.toUnix();
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
          createdAt: now,
          status: UserStatus.ACTIVE
        };
        await manager.getRepository(User).save(user);
      }
    }).then(() => this.logger.log(`[Traceo] Postgres migration run successfully.`))
      .catch((err) => this.logger.error(`[Traceo] Cannot run Postgres migration. Caused by: ${err}`));
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
