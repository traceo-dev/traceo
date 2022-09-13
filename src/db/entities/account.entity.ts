import { IsBoolean, IsEmail, IsEnum } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { GenericEntity } from "src/core/generic.entity";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";

export enum AccountRole {
  ADMIN = "admin",
  GUEST = "guest",
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled",
}

@Entity()
export class Account extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  username: string;

  @Column({ nullable: true, unique: true, type: 'varchar' })
  @IsEmail()
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  @IsEmail()
  gravatar: string;

  @Column({ select: false, nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: false })
  status: AccountStatus;

  @Column({ nullable: true, default: false })
  @IsBoolean()
  isAdmin: boolean;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.account,
    {
      cascade: true,
    },
  )
  applications: AccountMemberRelationship[];

  @OneToMany(() => Incident, (incident) => incident.assigned)
  incidents: Incident[];

  @Column({ nullable: false, type: "boolean", default: false })
  isPasswordUpdated: boolean;

  @Column({
    type: 'bigint',
    nullable: true
  })
  lastActiveAt?: number;
}
