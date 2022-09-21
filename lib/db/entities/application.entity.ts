import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";
import { GenericEntity } from "lib/core/generic.entity";
import { Environment } from "lib/core/generic.model";
import { Runtime } from "./runtime.entity";

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

  @Column({ nullable: false, default: 'development' })
  defaultEnv?: Environment = "development";

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
}
