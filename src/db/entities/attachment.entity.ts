import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { GenericEntity } from "src/core/generic.entity";

export enum AttachmentType {
  ACCOUNT_AVATAR = 'ACCOUNT_AVATAR',
  APPLICATION_AVATAR = 'APPLICATION_AVATAR'
}

@Entity()
export class Attachment extends GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    nullable: false,
  })
  accountId: string;

  @Column({
    type: 'enum',
    enum: AttachmentType,
    nullable: true
  })
  type: AttachmentType;

  @Column({
    type: 'varchar',
  })
  filename: string;

  @Column({
    type: 'varchar',
  })
  url: string;

  @Column({
    type: 'varchar',
  })
  mimetype: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  metadata?: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  bucketKey: string;

  @Column({
    type: 'integer',
  })
  size: number;
}
