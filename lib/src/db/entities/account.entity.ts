import { IsBoolean, IsEmail } from "class-validator";
import { BaseEntity } from "../../common/base/base.entity";
import { IUser, UserStatus, IAmr } from "@traceo/types";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { AccountMemberRelationship } from "./account-member-relationship.entity";
import { Incident } from "./incident.entity";

@Entity()
export class Account extends BaseEntity implements IUser {
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

  @Column({ select: false, nullable: false, type: 'varchar', unique: false })
  password: string;

  @Column({ nullable: false })
  status: UserStatus;

  @Column({ nullable: true, default: false, name: "is_admin" })
  @IsBoolean()
  isAdmin: boolean;

  @OneToMany(
    () => AccountMemberRelationship,
    (accountApp) => accountApp.account,
    {
      cascade: true,
    },
  )
  applications: IAmr[];

  @OneToMany(() => Incident, (incident) => incident.assigned)
  incidents: Incident[];

  @Column({
    nullable: false,
    type: "boolean",
    default: false,
    name: "is_password_updated"
  })
  isPasswordUpdated: boolean;

  @Column({
    type: 'bigint',
    nullable: true,
    name: "last_active_at"
  })
  lastActiveAt?: number;
}
