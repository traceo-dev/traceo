import { GenericEntity } from "../../core/generic.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { Application } from "./application.entity";
import { IAmr } from "../../../lib/types/interfaces/amr.interface";
import { MemberRole } from "../../../lib/types/enums/amr.enum";

@Entity()
export class AccountMemberRelationship extends GenericEntity implements IAmr {
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
