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

export enum MEMBER_STATUS {
  OWNER = "Owner",
  ADMINISTRATOR = "Administrator",
  DEVELOPER = "Developer",
}

@Entity()
export class AccountMemberRelationship extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  
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

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "application",
  })
  application: Application;
}
