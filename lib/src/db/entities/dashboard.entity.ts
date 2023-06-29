import { BaseEntity } from "../../common/base/base.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => Project, p => p.dashboards, {
        onDelete: "CASCADE"
    })
    project: Project;

    @OneToMany(() => DashboardPanel, (dp) => dp.dashboard, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    panels: IDashboardPanel[];
}