import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { Application } from "./application.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { ErrorDetails, IComment, IIncident, Platform, SDK, Trace } from "@traceo/types";

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
    type: "varchar"
  })
  type: string;

  @Column({
    type: "varchar"
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
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "application_id"
  })
  application: Application;

  @ManyToOne(() => User, (user) => user.incidents, {
    onDelete: "SET NULL"
  })
  @JoinColumn({
    name: "assigned_id"
  })
  assigned: User;

  @OneToMany(() => Comment, (comment) => comment.incident, { nullable: true })
  comments: IComment[];
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
