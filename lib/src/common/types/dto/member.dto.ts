import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { MemberRole } from "@traceo/types";

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  applicationId: string;

  @IsEnum(MemberRole)
  @IsNotEmpty()
  @ApiProperty()
  role: MemberRole;
}

export class UpdateMemberDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  memberId: string;

  @IsEnum(MemberRole)
  @IsOptional()
  @ApiProperty()
  role: MemberRole;
}
