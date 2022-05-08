import { Column, PrimaryGeneratedColumn } from "typeorm";

export class GenericEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({
        type: 'bigint',
        nullable: true
    })
    createdAt?: number;

    @Column({
        type: 'bigint',
        nullable: true
    })
    updatedAt?: number;
}