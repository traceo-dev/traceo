import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from "class-validator";
import { RELEASE_STATUS } from "src/db/entities/release.entity";

export class CreateReleaseModal {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'version' })
    public version?: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'applicationId' })
    public applicationId?: number;
}

export class ReleaseModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'release id' })
    public id?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'version' })
    public version?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'changelog' })
    public changelog?: string;

    @IsEnum(RELEASE_STATUS)
    @IsOptional()
    @ApiPropertyOptional({ description: 'status' })
    public status?: RELEASE_STATUS;
}