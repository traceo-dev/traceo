import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from "class-validator";
import { BaseDtoQuery } from "src/core/generic.model";
import { MemberRole } from "src/db/entities/account-member-relationship.entity";

export class ApplicationDtoQuery extends BaseDtoQuery {
  @IsOptional()
  @ApiPropertyOptional()
  favorite?: boolean;
}
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

  @IsOptional()
  @ApiProperty()
  favorite: boolean;
}
