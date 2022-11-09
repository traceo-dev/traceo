import { IComment } from "lib/types/interfaces/comment.interface";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { GenericEntity } from "../../core/generic.entity";
import { Account } from "./account.entity";
import { Incident } from "./incident.entity";

@Entity()
export class Comment extends GenericEntity implements IComment {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar",
  })
  message: string;

  @ManyToOne(() => Account)
  @JoinColumn({
    name: "senderId",
  })
  sender: Account;

  @Column({
    type: "bigint",
    nullable: true
  })
  lastUpdateAt?: number;

  @Column({
    type: "boolean",
    nullable: true
  })
  removed: boolean;

  @ManyToOne(() => Incident, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    nullable: false
  })
  @JoinColumn({
    name: "incidentId",
  })
  incident: Incident;
}
