import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty
} from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AccountWorkspaceRelationship } from "./account-workspace-relationship.entity";
import { Incident } from "./incident.entity";

export enum AccountRole {
  ADMIN = "admin",
  GUEST = "guest",
}

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ select: false, nullable: false })
  @IsEnum(AccountRole)
  role: AccountRole;

  @Column({ select: false, nullable: false })
  @IsBoolean()
  active: boolean;

  @Column({ nullable: true, select: false })
  activateHash?: string;

  @Column({ nullable: true })
  logo?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

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
