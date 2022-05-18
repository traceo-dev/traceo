import { GenericEntity } from "src/core/generic.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { MEMBER_STATUS } from "./account-workspace-relationship.entity";
import { Account } from "./account.entity";
import { Cluster } from "./cluster.entity";

@Entity()
export class AccountClusterRelationship extends GenericEntity {

  @Column("enum", {
    enum: MEMBER_STATUS,
    nullable: true,
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

  @ManyToOne(() => Cluster, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "cluster",
  })
  cluster: Cluster;
}
