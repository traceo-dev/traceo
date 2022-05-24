import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ReleaseStatus } from "src/db/entities/release.entity";

export class ReleaseModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'release id' })
    public id?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'changelog' })
    public changelog?: string;

    @IsEnum(ReleaseStatus)
    @IsOptional()
    @ApiPropertyOptional({ description: 'status' })
    public status?: ReleaseStatus;
}