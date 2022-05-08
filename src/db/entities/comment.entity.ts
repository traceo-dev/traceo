import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Account } from "./account.entity";
import { Incident } from "./incident.entity";

@Entity()
export class Comment extends GenericEntity {

    @Column({
        type: 'varchar'
    })
    message: string;

    @ManyToOne(() => Account)
    @JoinColumn({
      name: 'senderId'
    })
    sender: Account;

    @Column({
        type: 'bigint',
        nullable: true
    })
    lastUpdateAt?: number;

    @Column({
        type: 'bool',
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