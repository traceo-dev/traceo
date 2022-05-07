import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OccurrDate, Trace } from "../models/incident";
import { Environment, Platform } from "../models/release";
import { Account } from "./account.entity";
import { Comment } from "./comment.entity";
import { Workspace } from "./workspace.entity";

export enum IncidentStatus {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved",
    ARCHIVED = "archived",
    MUTED = "muted"
}

@Entity()
export class Incident extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    status: IncidentStatus;

    @Column({
        type: 'varchar'
    })
    env: Environment;

    @Column({
        type: 'varchar',
    })
    stack: string;

    @Column({
        type: 'varchar',
    })
    type: string;

    @Column({
        type: 'varchar',
    })
    message: string;

    @Column({
        type: 'bigint',
    })
    lastOccur: number;

    @Column({
        type: 'int'
    })
    occuredCount: number;

    @Column({
        type: 'varchar'
    })
    release: string;

    @Column({
        type: 'bigint'
    })
    createdAt: number;

    @Column({
        type: 'bigint',
        nullable: true
    })
    updatedAt: number;

    @Column({
        type: 'int',
        nullable: true,
        default: 0
    })
    commentsCount: number;

    @ManyToOne(() => Workspace, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "workspaceId"
    })
    workspace: Workspace;

    @ManyToOne(() => Account, account => account.incidents)
    @JoinColumn({
        name: "assignedId"
    })
    assigned: Account;

    @OneToMany(() => Comment, comment => comment.incident, { nullable: true })
    comments: Comment[];

    @Column({
        type: 'json',
        nullable: false,
    })
    platform: Platform;

    @Column({
        type: 'json'
    })
    occurDates: Array<OccurrDate>;

    @Column({
        type: 'json'
    })
    traces: Array<Trace>;
}