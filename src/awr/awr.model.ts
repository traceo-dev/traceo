import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { BaseDtoQuery } from "src/core/generic.model";
import { MEMBER_STATUS } from "src/db/entities/account-workspace-relationship.entity";

export class WorkspaceDtoQuery extends BaseDtoQuery {
    @IsOptional()
    @ApiPropertyOptional()
    favorite?: boolean;
}
export class AddAccountToWorkspaceModel {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    workspaceId: string;
}

export class AssignAccountToWorkspaceModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    workspaceId: string;
}

export class AwrModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;
    
    @IsEnum(MEMBER_STATUS)
    @IsOptional()
    @ApiProperty()
    status: MEMBER_STATUS;
        
    @IsOptional()
    @ApiProperty()
    favorite: boolean;
}