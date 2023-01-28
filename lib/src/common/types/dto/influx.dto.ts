import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseDataSourceDto } from "./data-source";

export class InfluxConfigurationDto extends BaseDataSourceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "url" })
    public url: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "token" })
    public token: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "org" })
    public org: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "bucket" })
    public bucket: string;
}