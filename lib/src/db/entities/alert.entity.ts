import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlertRule } from "./alert-rule.entity";
import { Member } from "./member.entity";
import { AlertEnumType, AlertSeverity, AlertStatus, IAlert, IMember, LogicOperator, ProjectMember } from "@traceo/types";
import { BaseEntity } from "src/common/base/base.entity";

@Entity()
export class Alert extends BaseEntity implements IAlert {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false })
    status: AlertStatus;

    @Column({ type: "varchar", nullable: false })
    type: AlertEnumType;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: false })
    description: string;

    @Column({ type: "varchar", nullable: false })
    severity: AlertSeverity;

    @Column({ type: "varchar", nullable: false, name: "logic_operator" })
    logicOperator: LogicOperator;

    @Column({ type: "boolean", nullable: false, name: "in_app_notification" })
    inAppNotification: boolean;

    @Column({ type: "boolean", nullable: false, name: "email_notification" })
    emailNotification: boolean;

    @OneToMany(() => AlertRule, (rule) => rule.alert, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    rules: AlertRule[];

    @ManyToMany(() => Member)
    @JoinTable()
    recipients: IMember[];
}