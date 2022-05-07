import dateUtils from "src/helpers/dateUtils";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Account } from "./account.entity";
import { Workspace } from "./workspace.entity";

export enum MEMBER_STATUS {
  OWNER = "Owner",
  ADMINISTRATOR = "Administrator",
  DEVELOPER = "Developer",
}

@Entity()
export class AccountWorkspaceRelationship extends BaseEntity {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("enum", {
    enum: MEMBER_STATUS,
    nullable: false,
  })
  status: MEMBER_STATUS;

  @Column({ nullable: true })
  createdAt: number;

  @Column({ nullable: true })
  updatedAt: number;

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
