import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { AlertRule } from "./alert-rule.entity";
import { Member } from "./member.entity";
import {
  AlertEnumType,
  AlertSeverity,
  AlertStatus,
  IAlert,
  IMember,
  IProject,
  LogicOperator
} from "@traceo/types";
import { BaseEntity } from "../../common/base/base.entity";
import { Project } from "./project.entity";
import { AlertHistory } from "./alert-history.entity";

@Entity()
export class Alert extends BaseEntity implements IAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  status: AlertStatus;

  @Column({ type: "bigint", nullable: true, name: "last_triggered" })
  lastTriggered: number;

  @Column({ type: "bigint", nullable: true, name: "muted_end_at" })
  mutedEndAt: number;

  @Column({ type: "varchar", nullable: false })
  type: AlertEnumType;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: false })
  severity: AlertSeverity;

  @Column({ type: "varchar", nullable: false, name: "logic_operator" })
  logicOperator: LogicOperator;

  @Column({ type: "boolean", nullable: false, name: "in_app_notification" })
  inAppNotification: boolean;

  @Column({ type: "boolean", nullable: false, name: "email_notification" })
  emailNotification: boolean;

  @Column({ type: "bigint", nullable: true, name: "min_time_interval" })
  minTimeInterval: number;

  @OneToMany(() => AlertRule, (rule) => rule.alert, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  rules: AlertRule[];

  @OneToMany(() => AlertHistory, (history) => history.alert, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  history: AlertHistory[];

  @ManyToMany(() => Member)
  @JoinTable({
    joinColumn: { name: "alert_id" },
    inverseJoinColumn: { name: "member_id" }
  })
  recipients: IMember[];

  @ManyToOne(() => Project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "project_id"
  })
  project: IProject;
}
