import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WorkspaceAccount } from "./workspace_account.entity";

export enum ROLE {
  ADMIN = "admin",
  GUEST = "guest",
}

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  _id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @Column({ select: false })
  @IsEnum(ROLE)
  @IsNotEmpty()
  role: ROLE;

  @Column({ select: false })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @Column({ nullable: true, select: false })
  activateHash?: string;

  @Column({ nullable: true })
  logo?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => WorkspaceAccount,
    (workspaceAccount) => workspaceAccount.account,
    {
      cascade: true,
    }
  )
  workspaces: WorkspaceAccount[];
}
