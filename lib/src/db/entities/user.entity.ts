import { IsBoolean, IsEmail } from "class-validator";
import { BaseEntity } from "../../common/base/base.entity";
import { IUser, UserStatus, IMember } from "@traceo/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { Incident } from "./incident.entity";

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: true, type: "varchar" })
  name: string;

  @Column({ unique: true, type: "varchar" })
  username: string;

  @Column({ type: "varchar", nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, type: "varchar" })
  @IsEmail()
  gravatar: string;

  @Column({ select: false, nullable: false, type: "varchar", unique: false })
  password: string;

  @Column({ nullable: false })
  status: UserStatus;

  @Column({ nullable: true, default: false, name: "is_admin" })
  @IsBoolean()
  isAdmin: boolean;

  // todo: remove
  @OneToMany(() => Member, (org) => org.user, {
    cascade: true
  })
  organizations: IMember[];

  // incidents assigned to this user
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
    type: "bigint",
    nullable: true,
    name: "last_active_at"
  })
  lastActiveAt?: number;

  // todo: remove
  @Column({ type: "varchar", nullable: true })
  defaultOrganizationId: string;
}
