import {
  IsBoolean,
  IsEmail,
  IsEnum,
} from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
  SUSPENDED = "suspended"
}

@Entity()
export class Account extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ nullable: true }) //TODO: this should be not optional
  status: AccountStatus;

  @Column({ nullable: false })
  @IsEnum(AccountRole)
  role: AccountRole;

  @Column({ nullable: false })
  @IsBoolean()
  active: boolean;

  @Column({ nullable: true, select: false })
  activateHash?: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.account,
    {
      cascade: true,
    }
  )
  applications: AccountMemberRelationship[];

  @OneToMany(() => Incident, incident => incident.assigned)
  incidents: Incident[];
}
