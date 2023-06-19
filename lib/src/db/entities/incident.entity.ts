import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IIncident, IProject, Platform, SDK, Trace } from "@traceo/types";

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
    nullable: false
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
    nullable: false,
    name: "last_event_at"
  })
  lastEventAt: number = this.createdAt;

  @Column({
    type: "bigint",
    nullable: false,
    name: "events_count"
  })
  eventsCount: number = 0;

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
