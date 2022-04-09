import { IsNotEmpty } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { WorkspaceAccount } from "./workspace_account.entity";

@Entity()
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  privateKey: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  @IsNotEmpty()
  owner?: Account;

  @Column({ nullable: true })
  shortDescription?: string;

  @Column({ nullable: true })
  aboutDescription?: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToMany(
    () => WorkspaceAccount,
    (workspaceAccount) => workspaceAccount.workspace,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    }
  )
  members?: WorkspaceAccount[];
}
