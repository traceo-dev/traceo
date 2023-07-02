import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/base/base.entity";
import { Dashboard } from "./dashboard.entity";
import { Dashboard as IDashboard, DashboardPanel as IDashboardPanel, PANEL_TYPE, PanelConfiguration, PanelGridPosition } from "@traceo/types";

@Entity()
export class DashboardPanel extends BaseEntity implements IDashboardPanel {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    title: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "varchar", nullable: true })
    type: PANEL_TYPE;

    @Column({
        type: "simple-json",
        nullable: false
    })
    gridPosition: PanelGridPosition;

    @Column({ type: "simple-json", nullable: false })
    config: PanelConfiguration;

    @ManyToOne(() => Dashboard, dashboard => dashboard.panels, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    dashboard: IDashboard;
}

