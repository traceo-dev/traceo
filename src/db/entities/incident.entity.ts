import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Comment } from "./comment.entity";
import { Release } from "./release.entity";
import { Application } from "./application.entity";
import { Trace } from "aws-sdk/clients/xray";
import { GenericEntity } from "src/core/generic.entity";
import { ErrorDetails, ErrorRelease } from "../models/incident";
import { Environment, Platform } from "../models/release";

export enum IncidentStatus {
    RESOLVED = "resolved",
    UNRESOLVED = "unresolved"
}

@Entity()
export class Incident extends GenericEntity {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    status: IncidentStatus;

    @Column({
        type: 'varchar',
        nullable: true
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
        type: 'json',
        nullable: true
    })
    release: ErrorRelease;

    @Column({
        type: 'varchar',
        nullable: true
    })
    githubIssueUrl: string;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "applicationId"
    })
    application: Application;

    @ManyToOne(() => Account, account => account.incidents)
    @JoinColumn({
        name: "assignedId"
    })
    assigned: Account;

    @OneToMany(() => Comment, comment => comment.incident, { nullable: true })
    comments: Comment[];
    commentsCount: number;

    @Column({
        type: 'json',
        nullable: false,
    })
    platform: Platform;

    @Column({
        type: 'json'
    })
    occurDates: Array<ErrorDetails>;

    @Column({
        type: 'json'
    })
    traces: Array<Trace>;

    @ManyToOne(() => Release, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
    })
    @JoinColumn({
        name: "resolved",
    })
    resolved?: Release;
}