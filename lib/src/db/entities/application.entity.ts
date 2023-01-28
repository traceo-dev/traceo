import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IApplication, ISecurity } from "@shared//interfaces/application.interface";
import { IInfluxDs } from "@shared//interfaces/influxds.interface";
import { IRuntime } from "@shared/interfaces/runtime.interface";
import { TSDB_PROVIDER } from "../../enums/tsdb.enum";
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

  @Column({
    type: "simple-json",
    nullable: true
  })
  security?: ISecurity;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'owner_id',
  })
  owner: Account;

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
    () => AccountMemberRelationship,
    (member) => member.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  )
  members?: AccountMemberRelationship[];
  membersCount?: number;

  @OneToMany(() => Incident, (incident) => incident.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  incidents?: Incident[];

  @Column({
    type: "bigint",
    nullable: false,
    name: "incidents_count",
    default: 0
  })
  incidentsCount?: number = 0;

  @Column({
    type: "bigint",
    nullable: false,
    name: "errors_count",
    default: 0
  })
  errorsCount?: number = 0;

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
  influxDS?: IInfluxDs;

  @Column({
    type: "varchar",
    nullable: true,
    name: "connected_tsdb"
  })
  connectedTSDB?: TSDB_PROVIDER;

  @OneToMany(() => Metric, (metric) => metric.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  metrics?: Metric[];
}
