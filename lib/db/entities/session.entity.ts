import { BaseEntity } from "lib/common/base/base.entity";
import { ISession } from "lib/common/types/interfaces/session.interface";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Session extends BaseEntity implements ISession {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar"
    })
    sessionID: string;

    @Column({
        type: "varchar"
    })
    accountID: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    accountName: string;

    @Column({
        type: "varchar"
    })
    accountIP: string;

    @Column({
        type: "bigint",
        nullable: true
    })
    expiryAt: number;

    @Column({
        type: "bigint",
        nullable: true
    })
    revokedAt: number;
}
