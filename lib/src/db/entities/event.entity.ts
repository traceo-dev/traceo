import { BrowserInfoType, IApplication, IEvent, IIncident } from "@traceo/types";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";
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

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "application_id"
    })
    application: IApplication;

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