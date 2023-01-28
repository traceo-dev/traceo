import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { MemberRole } from "@shared/enums/amr.enum";

export class AddAccountToApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    applicationId: string;

    @IsEnum(MemberRole)
    @IsNotEmpty()
    @ApiProperty()
    role: MemberRole;
}

export class UpdateAmrDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    memberId: string;

    @IsEnum(MemberRole)
    @IsOptional()
    @ApiProperty()
    role: MemberRole;
}
