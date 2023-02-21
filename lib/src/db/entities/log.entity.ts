import { BaseEntity } from "../../common/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";
import { IApplication, ILog, LogLevel } from "@traceo/types";

@Entity()
export class Log extends BaseEntity implements ILog {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({
    type: "varchar"
  })
  message: string;

  @Column({
    type: "varchar",
    nullable: true
  })
  timestamp: string;

  @Column({
    type: "bigint",
    nullable: true,
    name: "receive_timestamp"
  })
  receiveTimestamp: number;

  @Column({
    type: "simple-json",
    nullable: true
  })
  resources: object;

  @Column({ nullable: false })
  level: LogLevel;

  @ManyToOne(() => Application, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  @JoinColumn({
    name: "applicationId"
  })
  application: IApplication;
}
