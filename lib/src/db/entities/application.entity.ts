import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Member } from "./member.entity";
import { Incident } from "./incident.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IApplication, ISecurity, IUser, IMember, IIncident, SDK, IMetric, Dictionary } from "@traceo/types";
import { Metric } from "./metric.entity";

@Entity()
export class Application extends BaseEntity implements IApplication {
  @PrimaryColumn("varchar", {
    unique: true,
    nullable: false
  })
  id?: string;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "varchar", nullable: true })
  sdk: SDK;

  @Column({
    type: "simple-json",
    nullable: true
  })
  security?: ISecurity;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "owner_id"
  })
  owner: IUser;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({
    nullable: true,
    name: "last_event_at"
  })
  lastEventAt?: number;

  @Column({
    nullable: false,
    default: false,
    name: "is_integrated"
  })
  isIntegrated: boolean;

  @OneToMany(() => Member, (member) => member.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  members?: IMember[];
  membersCount: number;

  @OneToMany(() => Incident, (incident) => incident.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  incidents?: IIncident[];

  @Column({
    type: "bigint",
    nullable: false,
    name: "incidents_count",
    default: 0
  })
  incidentsCount: number = 0;

  @Column({
    type: "simple-json",
    nullable: true,
    name: "runtime_config"
  })
  runtimeConfig?: Dictionary<string | number | undefined | null>;

  @Column({
    nullable: true,
    name: "tsdb_datasource_id",
    type: "varchar"
  })
  tsdbDatasource?: string;

  @OneToMany(() => Metric, (metric) => metric.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  metrics?: IMetric[];
}
