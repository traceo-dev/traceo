import { GenericEntity } from "src/core/generic.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { Application } from "./application.entity";

export enum MemberRole {
  ADMINISTRATOR = "Administrator",
  MAINTAINER = "Maintainer",
  VIEWER = "Viewer"
}

@Entity()
export class AccountMemberRelationship extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  
  @Column("enum", {
    enum: MemberRole,
    nullable: false,
  })
  role: MemberRole;

  @Column({
    default: false,
    type: "bool"
  })
  favorite: boolean;

  @ManyToOne(() => Account, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "account",
  })
  account: Account;

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application",
  })
  application: Application;
}
