import { GenericEntity } from "../../core/generic.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./application.entity";
import { IInfluxDs } from "../../../lib/types/interfaces/influxds.interface";
import { CONNECTION_STATUS } from "../../../lib/types/enums/tsdb.enum";

@Entity()
export class InfluxDS extends GenericEntity implements IInfluxDs {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    url: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    token: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    org: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    bucket: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    connStatus: CONNECTION_STATUS;

    @Column({
        type: "varchar",
        nullable: true
    })
    connError: string;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "applicationId",
    })
    application: Application;
}
