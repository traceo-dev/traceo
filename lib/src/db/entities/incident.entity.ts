import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Event } from "./event.entity";
import { Project } from "./project.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IEvent, IIncident, IProject, Platform, SDK, Trace } from "@traceo/types";

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress"
}

@Entity()
export class Incident extends BaseEntity implements IIncident {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  sdk: SDK;

  @Column({
    type: "varchar",
    nullable: false
  })
  status: IncidentStatus;

  @Column({
    type: "varchar",
    nullable: true
  })
  stack: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  name: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  message: string;

  @Column({
    type: "bigint",
    nullable: true,
    name: "last_event_at"
  })
  lastEventAt: number;

  @ManyToOne(() => Project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "project_id"
  })
  project: IProject;

  @ManyToOne(() => User, (user) => user.incidents, {
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "assigned_id"
  })
  assigned: User;

  @OneToMany(() => Event, (error) => error.incident)
  events: IEvent[];
  eventsCount: number;

  @Column({
    type: "simple-json",
    nullable: true
  })
  platform: Platform;

  @Column({
    type: "simple-json",
    nullable: true
  })
  traces: Array<Trace>;
}
