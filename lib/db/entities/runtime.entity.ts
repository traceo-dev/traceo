import { GenericEntity } from "lib/core/generic.entity";
import { Environment } from "lib/core/generic.model";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Application } from "./application.entity";


@Entity()
export class Runtime extends GenericEntity {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    env: Environment;

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
