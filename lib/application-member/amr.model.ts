import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { BaseDtoQuery } from "../core/query/generic.model";
import { MemberRole } from "../db/entities/account-member-relationship.entity";

export class ApplicationDtoQuery extends BaseDtoQuery { }
export class AddAccountToApplicationModel {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  applicationId: number;

  @IsEnum(MemberRole)
  @IsNotEmpty()
  @ApiProperty()
  role: MemberRole;
}

export class UpdateAmrModel {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  memberId: string;

  @IsEnum(MemberRole)
  @IsOptional()
  @ApiProperty()
  role: MemberRole;
}
