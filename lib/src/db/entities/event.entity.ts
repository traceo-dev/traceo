import { BrowserInfoType, IProject, IEvent, IIncident } from "@traceo/types";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { Incident } from "./incident.entity";

@Entity()
export class Event extends BaseEntity implements IEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "bigint",
        nullable: false
    })
    date: number;

    @Column({
        type: "simple-json",
        nullable: true
    })
    browser?: BrowserInfoType;

    @ManyToOne(() => Project, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "project_id"
    })
    project: IProject;

    @ManyToOne(() => Incident, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        nullable: false
    })
    @JoinColumn({
        name: "incident_id"
    })
    incident: IIncident;
}