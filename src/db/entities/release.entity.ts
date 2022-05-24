import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Deployment, Environment, Platform } from "../models/release";
import { Workspace } from "./workspace.entity";

export enum ReleaseStatus {
    ACTIVE = "active",
    CLOSED = "closed"
}

@Entity()
export class Release extends GenericEntity {

    @Column({
        type: 'varchar',
        nullable: true
    })
    status: ReleaseStatus;
    
    @Column({
        type: 'varchar'
    })
    env: Environment;

    @Column({
        type: 'varchar'
    })
    version: string;

    @Column({
        type: 'varchar'
    })
    versionSetter: string;

    @Column({
        type: 'bigint'
    })
    lastDeploymentAt: number;

    @Column({
        type: 'json',
        nullable: true
    })
    os: Platform;

    @Column({
        type: 'int'
    })
    incidentsOccurCount: number;

    @Column({
        type: 'int'
    })
    incidentsCount: number;

    @Column({
        type: 'json',
        nullable: true
    })
    deployments: Array<Deployment>

    @Column({
        type: 'varchar',
        nullable: true,
        default: "Place for your changes"
    })
    changelog: string;

    @ManyToOne(() => Workspace, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "workspaceId"
    })
    workspace: Workspace;
}
