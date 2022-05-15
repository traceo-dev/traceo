import {
  IsBoolean,
  IsEmail,
  IsEnum,
} from "class-validator";
import { GenericEntity } from "src/core/generic.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { AccountWorkspaceRelationship } from "./account-workspace-relationship.entity";
import { Github } from "./github.entity";
import { Incident } from "./incident.entity";

export enum AccountRole {
  ADMIN = "admin",
  GUEST = "guest",
}

@Entity()
export class Account extends GenericEntity {

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ nullable: false })
  @IsEnum(AccountRole)
  role: AccountRole;

  @Column({ select: false, nullable: false })
  @IsBoolean()
  active: boolean;

  @Column({ nullable: true, select: false })
  activateHash?: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToOne(() => Github, {
    cascade: true,
    // onDelete: "CASCADE",
    // onUpdate: "CASCADE"
  })
  @JoinColumn()
  github: Github;

  @OneToMany(
    () => AccountWorkspaceRelationship,
    (accountWorkspace) => accountWorkspace.account,
    {
      cascade: true,
    }
  )
  workspaces: AccountWorkspaceRelationship[];

  @OneToMany(() => Incident, incident => incident.assigned)
  incidents: Incident[];
}
