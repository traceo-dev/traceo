import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Incident } from "./incident.entity";
import { BaseEntity } from "../../common/base/base.entity";
import { IUser, IIncident, SDK, IMetric, Dictionary, IProject, IMember } from "@traceo/types";
import { Metric } from "./metric.entity";
import { Member } from "./member.entity";

@Entity()
export class Project extends BaseEntity implements IProject {
  @PrimaryColumn("varchar", {
    unique: true,
    nullable: false
  })
  id?: string;

  @Column({ type: "varchar", unique: true })
  name: string;

  @Column({ type: "varchar", nullable: true })
  sdk: SDK;

  @Column({
    type: "varchar",
    nullable: true,
    name: "api_key"
  })
  apiKey: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "owner_id"
  })
  owner: IUser;

  @Column({ nullable: true })
  gravatar?: string;

  @Column({
    nullable: true,
    name: "last_event_at"
  })
  lastEventAt?: number;

  @Column({
    nullable: false,
    default: false,
    name: "is_integrated"
  })
  isIntegrated: boolean;

  @OneToMany(() => Incident, (incident) => incident.project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  incidents?: IIncident[];
  incidentsCount: number = 0;

  @OneToMany(() => Metric, (metric) => metric.project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  metrics?: IMetric[];

  @OneToMany(() => Member, (member) => member.project, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  members?: IMember[];
  membersCount: number;
}
