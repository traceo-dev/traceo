import { BaseEntity } from "../../common/base/base.entity";
import { IMetric, IMetricConfiguration, IMetricSerie, METRIC_UNIT } from "../../common/types/interfaces/metrics.interface";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";

@Entity()
export class Metric extends BaseEntity implements IMetric {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "varchar", nullable: false })
    name: string;

    @Column({ type: "varchar", nullable: true })
    description: string;

    @Column({ type: "boolean", default: false, nullable: false })
    show: boolean;

    @Column({ type: "boolean", default: false, nullable: false, name: "show_description" })
    showDescription: boolean;

    @Column({ type: "boolean", default: false, nullable: false, name: "is_default" })
    isDefault: boolean;

    @Column({ type: "varchar", nullable: false })
    unit: METRIC_UNIT | string;

    @Column({ type: "simple-json", nullable: false })
    series: IMetricSerie[];

    @Column({ type: "simple-json", nullable: false })
    config: IMetricConfiguration;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "application_id",
    })
    application: Application;
}