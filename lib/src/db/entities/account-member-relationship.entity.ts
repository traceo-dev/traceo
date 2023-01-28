import { BaseEntity } from "../../common/base/base.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { Application } from "./application.entity";
import { MemberRole } from "../../enums/amr.enum";
import { IAmr } from "@shared/interfaces/amr.interface";

@Entity()
export class AccountMemberRelationship extends BaseEntity implements IAmr {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column("simple-enum", {
    enum: MemberRole,
    nullable: false,
  })
  role: MemberRole;

  @ManyToOne(() => Account, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
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
