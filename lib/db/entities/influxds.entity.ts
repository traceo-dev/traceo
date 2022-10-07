import { GenericEntity } from "lib/core/generic.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./application.entity";

@Entity()
export class InfluxDS extends GenericEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    url: string;

    @Column({
        type: "varchar",
        nullable: true,
        select: false
    })
    token: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    org: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    bucket: string;

    @Column({
        type: "bigint",
        nullable: true
    })
    timeout: number;

    @Column({
        type: "bigint",
        nullable: true
    })
    interval: number;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "applicationId",
    })
    application: Application;
}
