import { GenericEntity } from "../../core/generic.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./application.entity";
import { IRuntime } from "../../../lib/types/interfaces/runtime.interface";


@Entity()
export class Runtime extends GenericEntity implements IRuntime {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "simple-json",
        nullable: true
    })
    data: object;

    @ManyToOne(() => Application, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({
        name: "applicationId",
    })
    application: Application;
}
