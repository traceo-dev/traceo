import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Deployment, Environment, Platform } from "../models/release";
import { Workspace } from "./workspace.entity";

@Entity()
export class Release extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
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
        type: 'bigint'
    })
    createdAt: number;

    @Column({
        type: 'bigint',
        nullable: true
    })
    updatedAt: number;

    @Column({
        type: 'json',
        nullable: true
    })
    deployments: Array<Deployment>

    @ManyToOne(() => Workspace, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "workspaceId"
    })
    workspace: Workspace;
}
