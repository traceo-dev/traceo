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
import { ErrorDetails, Platform, Trace } from "../../types/incident";

export enum IncidentStatus {
  RESOLVED = "resolved",
  UNRESOLVED = "unresolved",
  IN_PROGRESS = "in_progress"
}

@Entity()
export class Incident extends GenericEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  status: IncidentStatus;

  @Column({
    type: "varchar",
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
    nullable: true
  })
  lastError: number;

  @Column({
    type: "int",
  })
  errorsCount: number;

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "applicationId",
  })
  application: Application;

  @ManyToOne(() => Account, (account) => account.incidents)
  @JoinColumn({
    name: "assignedId",
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
    nullable: true
  })
  errorsDetails: Array<ErrorDetails>;

  @Column({
    type: "simple-json",
    nullable: true
  })
  traces: Array<Trace>;
}
