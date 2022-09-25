import { GenericEntity } from "lib/core/generic.entity";
import { Environment } from "lib/core/generic.model";
import { LogLevel } from "lib/types/logs";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./application.entity";


@Entity()
export class Log extends GenericEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar"
    })
    env: Environment;

    @Column({
        type: "varchar"
    })
    message: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    timestamp: string;

    @Column({
        type: "bigint",
        nullable: true
    })
    receiveTimestamp: number;

    @Column({
        type: "json",
        nullable: true
    })
    resources: object;

    @Column({ nullable: false })
    level: LogLevel;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "applicationId",
    })
    application: Application;
}
