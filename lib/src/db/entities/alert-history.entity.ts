import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Alert } from "./alert.entity";
import { IAlert, IAlertHistory } from "@traceo/types";
import { BaseEntity } from "../../common/base/base.entity";

@Entity()
export class AlertHistory extends BaseEntity implements IAlertHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    reason: string;

    @Column({ type: "varchar", nullable: false })
    triggeredAt: number;

    @ManyToOne(() => Alert, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "alert_id"
    })
    alert: IAlert;
}