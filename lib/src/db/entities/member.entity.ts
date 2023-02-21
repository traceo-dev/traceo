import { BaseEntity } from "../../common/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Application } from "./application.entity";
import { IMember, MemberRole } from "@traceo/types";

@Entity()
export class Member extends BaseEntity implements IMember {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

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
    name: "user"
  })
  user: User;

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "application"
  })
  application: Application;
}
