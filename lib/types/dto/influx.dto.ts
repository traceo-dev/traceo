import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class InfluxConfigurationDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "appId" })
    public appId?: number;

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