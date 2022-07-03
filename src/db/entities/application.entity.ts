import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountApplicationRelationship } from "./account-application-relationship.entity";
import { Incident } from "./incident.entity";
import { Release } from "./release.entity";
import { GenericEntity } from "src/core/generic.entity";
import { GithubRepository } from "../models/github";
import { Environment } from "../models/release";

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
    () => AccountApplicationRelationship,
    (accountApp) => accountApp.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  members?: AccountApplicationRelationship[];


  @OneToMany(
    () => Incident,
    (incident) => incident.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  incidents?: Incident[];
  incidentsCount?: number;

  @OneToMany(
    () => Release,
    (release) => release.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  releases?: Release[];
}
