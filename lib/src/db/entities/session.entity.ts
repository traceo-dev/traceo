import { BaseEntity } from "../../common/base/base.entity";
import { ISession } from "@traceo/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Session extends BaseEntity implements ISession {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar"
  })
  sessionID: string;

  @Column({
    type: "varchar"
  })
  userID: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  userName: string;

  @Column({
    type: "varchar"
  })
  userIP: string;

  @Column({
    type: "bigint",
    nullable: false
  })
  expiryAt: number;

  @Column({
    type: "bigint",
    nullable: true
  })
  revokedAt: number;
}
