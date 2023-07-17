import { BaseEntity } from "../../common/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DashboardPanel } from "./dashboard-panel.entity";
import { Project } from "./project.entity";
import { Dashboard as IDashboard, DashboardPanel as IDashboardPanel } from "@traceo/types";

@Entity()
export class Dashboard extends BaseEntity implements IDashboard {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    description: string;

    @Column({
        type: "bool",
        nullable: true,
        default: false
    })
    isBase: boolean;

    @Column({
        type: "bool",
        nullable: true,
        default: true
    })
    isEditable: boolean;

    @Column({
        type: "bool",
        nullable: true,
        default: true
    })
    isTimePicker: boolean;

    @ManyToOne(() => Project, p => p.dashboards, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "project_id"
    })
    project: Project;

    @OneToMany(() => DashboardPanel, (dp) => dp.dashboard, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    panels: IDashboardPanel[];
}