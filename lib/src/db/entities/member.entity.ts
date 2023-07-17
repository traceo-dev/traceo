import { BaseEntity } from "../../common/base/base.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { IMember, MemberRole } from "@traceo/types";
import { Alert } from "./alert.entity";

@Entity()
export class Member extends BaseEntity implements IMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("simple-enum", {
    enum: MemberRole,
    nullable: false
  })
  role: MemberRole;

  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "user_id"
  })
  user: User;

  @ManyToOne(() => Project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "project_id"
  })
  project: Project;

  @ManyToMany(() => Alert)
  alerts: Alert[];
}
