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
import { GenericEntity } from "src/core/generic.entity";
import { Environment } from "src/core/generic.model";
import { GithubRepository } from "src/types/github";

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

  @Column({ nullable: false, default: 'development' })
  defaultEnv?: Environment = "development";

  @Column({
    type: 'json',
    nullable: true
  })
  github?: GithubRepository;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.application,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  )
  members?: AccountMemberRelationship[];


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
}
