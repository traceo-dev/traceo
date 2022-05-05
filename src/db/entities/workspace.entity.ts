import { IsNotEmpty } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Account } from "./account.entity";
import { AccountWorkspaceRelationship } from "./account-workspace-relationship.entity";
import dateUtils from "src/helpers/dateUtils";
import { Environment } from "../documents/release";

@Entity()
export class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  privateKey: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  @IsNotEmpty()
  owner: Account;

  @Column({ nullable: true, length: 256, type: 'varchar' })
  aboutDescription?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  createdAt: number;

  @Column({ nullable: true })
  updatedAt: number;

  @Column({ nullable: true })
  lastIncidentAt: number;

  @Column({ nullable: false, default: 'dev'})
  defaultEnv: Environment;

  @OneToMany(
    () => AccountWorkspaceRelationship,
    (accountWorkspace) => accountWorkspace.workspace,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    }
  )
  members?: AccountWorkspaceRelationship[];

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = dateUtils.toUnix();
  }

  @BeforeInsert()
  public setCreatedAt() {
    this.createdAt = dateUtils.toUnix();
  }
}
