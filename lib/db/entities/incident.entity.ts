import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Account } from "./account.entity";
import { Comment } from "./comment.entity";
import { Application } from "./application.entity";
import { GenericEntity } from "../../core/generic.entity";
import { ErrorDetails, IIncident, Platform, Trace } from "../../../lib/types/interfaces/incident.interface";

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress"
}

@Entity()
export class Incident extends GenericEntity implements IIncident {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

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
  })
  type: string;

  @Column({
    type: "varchar",
  })
  message: string;

  @Column({
    type: "bigint",
    nullable: true,
    name: "last_error"
  })
  lastError: number;

  @Column({
    type: "int",
    name: "errors_count",
    default: 0
  })
  errorsCount: number;

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application_id",
  })
  application: Application;

  @ManyToOne(() => Account, (account) => account.incidents, {
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "assigned_id",
  })
  assigned: Account;

  @OneToMany(() => Comment, (comment) => comment.incident, { nullable: true })
  comments: Comment[];
  commentsCount: number;

  @Column({
    type: "simple-json",
    nullable: true
  })
  platform: Platform;

  @Column({
    type: "simple-json",
    nullable: true,
    name: "errors_details"
  })
  errorsDetails: Array<ErrorDetails>;

  @Column({
    type: "simple-json",
    nullable: true
  })
  traces: Array<Trace>;
}
