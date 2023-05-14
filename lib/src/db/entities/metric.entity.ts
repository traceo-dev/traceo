import { BaseEntity } from "../../common/base/base.entity";
import { IMetric, IMetricConfiguration, IMetricSerie, METRIC_UNIT } from "@traceo/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

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

  @Column({ type: "varchar", nullable: true })
  unit: METRIC_UNIT | string;

  @Column({ type: "simple-json", nullable: false })
  series: IMetricSerie[];

  @Column({ type: "simple-json", nullable: false })
  config: IMetricConfiguration;

  @ManyToOne(() => Project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "project_id"
  })
  project: Project;
}
