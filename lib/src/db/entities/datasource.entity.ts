import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import { BaseEntity } from "@common/base/base.entity";
import { DatasourceProvider, IDatasource } from "@traceo/types";

@Entity()
export class Datasource extends BaseEntity implements IDatasource {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        name: "app_id",
        type: "varchar",
        nullable: false
    })
    appId: string;

    @Column({
        type: "varchar",
        nullable: true
    })
    name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    type: DatasourceProvider;

    @Column({
        type: "varchar",
        nullable: false
    })
    url: string;

    @Column({
        type: "simple-json",
        nullable: true
    })
    details: { [key: string]: any };
}
