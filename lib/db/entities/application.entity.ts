import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";
import { GenericEntity } from "../../core/generic.entity";
import { Runtime } from "./runtime.entity";
import { InfluxDS } from "./influxds.entity";
import { TSDB } from "../../types/tsdb";

@Entity()
export class Application extends GenericEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  privateKey: string;

  @Column({ type: 'varchar', nullable: true })
  dsn?: string;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'ownerId',
  })
  owner: Account;

  @Column({ nullable: true, length: 256, type: 'varchar' })
  aboutDescription?: string;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({ nullable: true })
  lastIncidentAt?: number;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.application,
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
  incidentsCount?: number;

  @OneToMany(() => Runtime, (runtime) => runtime.application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  runtimeData?: Runtime[];

  @ManyToOne(() => InfluxDS)
  @JoinColumn({
    name: 'influxId',
  })
  influxDS?: InfluxDS;

  @Column({
    type: "varchar",
    nullable: true
  })
  connectedTSDB?: TSDB;
}
