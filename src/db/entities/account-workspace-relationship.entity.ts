import { GenericEntity } from "src/core/generic.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Account } from "./account.entity";
import { Workspace } from "./workspace.entity";

export enum MEMBER_STATUS {
  OWNER = "Owner",
  ADMINISTRATOR = "Administrator",
  DEVELOPER = "Developer",
}

@Entity()
export class AccountWorkspaceRelationship extends GenericEntity {

  @Column("enum", {
    enum: MEMBER_STATUS,
    nullable: false,
  })
  status: MEMBER_STATUS;

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

  @ManyToOne(() => Workspace, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "workspace",
  })
  workspace: Workspace;
}
