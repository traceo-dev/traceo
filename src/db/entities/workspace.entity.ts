import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountWorkspaceRelationship } from "./account-workspace-relationship.entity";
import { Environment } from "../models/release";
import { Incident } from "./incident.entity";
import { Release } from "./release.entity";
import { GenericEntity } from "src/core/generic.entity";
import { Github } from "./github.entity";
import { Cluster } from "./cluster.entity";
import { GithubRepository } from "../models/github";

@Entity()
export class Workspace extends GenericEntity {

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

  @Column({ nullable: true, type: 'varchar' })
  technology?: string;

  @Column({ nullable: true, type: 'varchar' })
  framework?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  lastIncidentAt?: number;

  @Column({ nullable: false, default: 'dev' })
  defaultEnv?: Environment = "dev";

  @Column({
    type: 'json',
    nullable: true
  })
  github?: GithubRepository;

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

  @ManyToOne(() => Cluster, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "cluster",
  })
  cluster?: Cluster;
}
