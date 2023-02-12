import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { DatasourceProvider } from "@traceo/types";

export class BaseDataSourceDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: "datasource id if already exists" })
    public id?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "appId" })
    public appId?: string;

    @IsEnum(DatasourceProvider)
    @IsNotEmpty()
    @ApiProperty({ description: "provider" })
    public provider: DatasourceProvider;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "url" })
    public url?: string;

    @IsNotEmpty()
    @ApiProperty({ description: "datasource details" })
    public details: { [key: string]: any }
}