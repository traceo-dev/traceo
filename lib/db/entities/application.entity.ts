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
import { GenericEntity } from "../../core/generic.entity";
import { Runtime } from "./runtime.entity";
import { IApplication, ISecurity } from "../../../lib/types/interfaces/application.interface";
import { TSDB } from "../../../lib/types/enums/tsdb.enum";
import { IInfluxDs } from "../../../lib/types/interfaces/influxds.interface";

@Entity()
export class Application extends GenericEntity implements IApplication {
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
    name: 'ownerId',
  })
  owner: Account;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({ nullable: true })
  lastIncidentAt?: number;

  @Column({ nullable: false, default: false })
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
    name: "incidentscount",
    default: 0
  })
  incidentsCount?: number = 0;

  @Column({
    type: "bigint",
    nullable: false,
    name: "errorscount",
    default: 0
  })
  errorsCount?: number = 0;

  @OneToMany(() => Runtime, (runtime) => runtime.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  runtimeData?: Runtime[];

  @Column({
    type: "simple-json",
    nullable: true
  })
  influxDS?: IInfluxDs;

  @Column({
    type: "varchar",
    nullable: true
  })
  connectedTSDB?: TSDB;
}
