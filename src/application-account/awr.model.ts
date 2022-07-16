import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BaseDtoQuery } from "src/core/generic.model";
import { MEMBER_STATUS } from "src/db/entities/account-application-relationship.entity";

export class ApplicationDtoQuery extends BaseDtoQuery {
    @IsOptional()
    @ApiPropertyOptional()
    favorite?: boolean;
}
export class AddAccountToApplicationModel {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    appId: number;
}

export class AssignAccountToApplicationModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    appId: number;
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