import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Deployment, Environment, Platform } from "../models/release";
import { Workspace } from "./workspace.entity";

export enum RELEASE_STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CLOSED = "closed"
}

@Entity()
export class Release extends GenericEntity {

    @Column({
        type: 'varchar',
        nullable: true
    })
    status: RELEASE_STATUS;
    
    @Column({
        type: 'varchar'
    })
    env: Environment;

    @Column({
        type: 'varchar'
    })
    version: string;

    @Column({
        type: 'bigint',
        nullable: true
    })
    lastDeploymentAt: number;

    @Column({
        type: 'json',
        nullable: true
    })
    os: Platform;

    @Column({
        type: 'int',
        nullable: true,
        default: 0
    })
    incidentsOccurCount: number = 0;

    @Column({
        type: 'int',
        nullable: true,
        default: 0
    })
    incidentsCount: number = 0;

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
