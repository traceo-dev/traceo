import { GenericEntity } from 'src/core/generic.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AttachmentType {
  ACCOUNT_AVATAR = 'ACCOUNT_AVATAR',
  WORKSPACE_AVATAR = 'WORKSPACE_AVATAR'
}

@Entity()
export class Attachment extends GenericEntity {

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
