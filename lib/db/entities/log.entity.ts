import { GenericEntity } from "../../core/generic.entity";
import { LogLevel } from "../../types/worker";
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
        type: "simple-json",
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
