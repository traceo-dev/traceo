import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Environment } from "src/db/models/release";

export class CreateWorkspaceModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name' })
    public name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'aboutDescription' })
    public aboutDescription: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'framework' })
    public framework: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'technology' })
    public technology: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'cluster' })
    public clusterId: string;
}

export class WorkspaceModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'workspace id' })
    public id?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'workspace name' })
    public name?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'workspace logo url' })
    public logo?: string;

    @IsString()
    @IsOptional()
    @MaxLength(256)
    @ApiProperty({ description: 'workspace about description' })
    public aboutDescription?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'workspace default env' })
    public defaultEnv?: Environment;
}