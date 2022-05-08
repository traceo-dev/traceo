import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Deployment, Environment, Platform } from "../models/release";
import { Workspace } from "./workspace.entity";

@Entity()
export class Release extends GenericEntity {
    
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

    @ManyToOne(() => Workspace, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "workspaceId"
    })
    workspace: Workspace;
}
