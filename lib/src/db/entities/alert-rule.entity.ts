import { IAlert, IAlertRule } from "@traceo/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "./alert.entity";
import { BaseEntity } from "../../common/base/base.entity";

@Entity()
export class AlertRule extends BaseEntity implements IAlertRule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "bigint", nullable: true, name: "last_triggered" })
  lastTriggered: number;

  @Column({ type: "varchar", nullable: false })
  type: string;

  @Column({ type: "varchar", nullable: true })
  field: string;

  @Column({ type: "varchar", nullable: true })
  operator: string;

  @Column({ type: "varchar", nullable: true })
  value: string;

  @Column({ type: "varchar", nullable: true })
  count: number;

  @Column({ type: "varchar", nullable: true })
  time: number;

  @Column({ type: "varchar", nullable: true })
  incidentId: string;

  @Column({ type: "varchar", nullable: true })
  metricId: string;

  @ManyToOne(() => Alert, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "alert_id"
  })
  alert: IAlert;
}
