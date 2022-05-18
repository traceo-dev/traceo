import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Account } from "./account.entity";
import { Workspace } from "./workspace.entity";

@Entity()
export class Cluster extends GenericEntity {

    @Column({
        type: "varchar"
    })
    name: string;

    @Column({
        type: "int",
        nullable: true,
        default: 0
    })
    appsCount?: number;

    @Column({
        type: "varchar",
        nullable: true
    })
    description?: string;

    @ManyToOne(() => Account)
    @JoinColumn({
      name: 'ownerId'
    })
    owner: Account;

    @OneToMany(
        () => Workspace,
        (workspace) => workspace.cluster,
        {
            cascade: true,
        }
    )
    workspaces: Workspace[];
}