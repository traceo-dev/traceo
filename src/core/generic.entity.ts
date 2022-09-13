import { Column, PrimaryGeneratedColumn } from "typeorm";

export class GenericEntity {
  @Column({
    type: "bigint",
    nullable: true
  })
  createdAt?: number;

  @Column({
    type: "bigint",
    nullable: true
  })
  updatedAt?: number;
}
