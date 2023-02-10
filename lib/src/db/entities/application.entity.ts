import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "./user.entity";
import { MemberEntity } from "./member.entity";
import { Incident } from "./incident.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IApplication, ISecurity, IInfluxConfigDto, IRuntime, TsdbProvider, IUser, IMember, IIncident, ApplicationTechnology } from "@traceo/types";
import { Metric } from "./metric.entity";

@Entity()
export class Application extends BaseEntity implements IApplication {
  @PrimaryColumn("varchar", {
    unique: true,
    nullable: false
  })
  id?: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  technology: ApplicationTechnology;

  @Column({
    type: "simple-json",
    nullable: true
  })
  security?: ISecurity;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'owner_id',
  })
  owner: IUser;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({
    nullable: true,
    name: "last_incident_at"
  })
  lastIncidentAt?: number;

  @Column({
    nullable: false,
    default: false,
    name: "is_integrated"
  })
  isIntegrated: boolean;

  @OneToMany(
    () => MemberEntity,
    (member) => member.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  )
  members?: IMember[];
  membersCount: number;

  @OneToMany(() => Incident, (incident) => incident.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
    type: "bigint",
    nullable: false,
    name: "errors_count",
    default: 0
  })
  errorsCount: number = 0;

  @Column({
    type: "simple-json",
    nullable: true,
    name: "runtime_config"
  })
  runtimeConfig?: IRuntime;

  @Column({
    type: "simple-json",
    nullable: true,
    name: "influx_ds"
  })
  influxConfig?: IInfluxConfigDto;

  @Column({
    type: "varchar",
    nullable: true,
    name: "connected_tsdb"
  })
  tsdbProvider?: TsdbProvider;

  @OneToMany(() => Metric, (metric) => metric.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  metrics?: Metric[];
}
