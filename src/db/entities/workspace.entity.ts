import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountWorkspaceRelationship } from "./account-workspace-relationship.entity";
import { Environment } from "../models/release";
import { Incident } from "./incident.entity";
import { Release } from "./release.entity";

@Entity()
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  privateKey: string;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: 'ownerId'
  })
  owner: Account;

  @Column({ nullable: true, length: 256, type: 'varchar' })
  aboutDescription?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({
    type: 'bigint'
  })
  createdAt: number;

  @Column({
    type: 'bigint',
    nullable: true
  })
  updatedAt: number;

  @Column({ nullable: true })
  lastIncidentAt: number;

  @Column({ nullable: false, default: 'dev' })
  defaultEnv: Environment;

  @OneToMany(
    () => AccountWorkspaceRelationship,
    (accountWorkspace) => accountWorkspace.workspace,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  members?: AccountWorkspaceRelationship[];

  @OneToMany(
    () => Incident,
    (incident) => incident.workspace,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  incidents?: Incident[];

  @OneToMany(
    () => Release,
    (release) => release.workspace,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  releases?: Release[];
}
