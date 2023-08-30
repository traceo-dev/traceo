import { IDatasource, IProject } from "@traceo/types";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity()
export class Datasource extends BaseEntity implements IDatasource {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", unique: true })
    name: string;

    @Column({ type: "simple-json", nullable: false })
    config: string;

    @Column({ type: "varchar", nullable: false })
    type: DATASOURCE_PROVIDER;

    @ManyToOne(() => Project, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "project_id"
    })
    project: IProject;
}

enum DATASOURCE_PROVIDER {
    HTTP,
    MONGODB,
    POSTGRESQL,
    MYSQL,
    CLICKHOUSE
}