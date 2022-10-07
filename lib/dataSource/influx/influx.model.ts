import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class InfluxConfigurationBody {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "appId" })
    public appId: number;

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

    @IsOptional()
    // @IsNumber()
    @ApiProperty({ description: "timeout" })
    public timeout: number;

    @IsOptional()
    // @IsNumber()
    @ApiProperty({ description: "interval" })
    public interval: number;
}

export interface InfluxConfiguration {
    url: string;
    token: string;
    org: string;
    bucket: string;
}
