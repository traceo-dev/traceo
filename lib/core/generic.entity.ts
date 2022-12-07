import { Column } from "typeorm";

export class GenericEntity {
  @Column({
    type: "bigint",
    nullable: true,
    name: "created_at"
  })
  createdAt?: number;

  @Column({
    type: "bigint",
    nullable: true,
    name: "updated_at"
  })
  updatedAt?: number;
}
