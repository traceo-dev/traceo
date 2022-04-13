import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Environment } from "src/db/documents/release";

export class CreateWorkspaceModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'workspace name' })
    public name: string;
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