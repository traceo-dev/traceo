import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TSDB_PROVIDER } from "@traceo/types";

export class BaseDataSourceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "appId" })
    public appId?: string;

    @IsEnum(TSDB_PROVIDER)
    @IsNotEmpty()
    @ApiProperty({ description: "provider" })
    public provider: TSDB_PROVIDER;
}