import { Column } from "typeorm";

export class BaseEntity {
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
