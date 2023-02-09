import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { TsdbProvider } from "@traceo/types";

export class BaseDataSourceDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "appId" })
    public appId?: string;

    @IsEnum(TsdbProvider)
    @IsOptional()
    @ApiProperty({ description: "provider" })
    public provider: TsdbProvider;
}