import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { Workspace } from "./workspace.entity";

export enum MEMBER_STATUS {
  OWNER = "Owner",
  ADMINISTRATOR = "Administrator",
  DEVELOPER = "Developer",
}

@Entity()
export class WorkspaceAccount extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column("enum", {
    enum: MEMBER_STATUS,
    nullable: false,
  })
  status: MEMBER_STATUS;

  @Column()
  lastUpdate: number;

  @Column({
    type: "boolean",
    default: false,
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
