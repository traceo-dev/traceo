import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CONNECTION_STATUS } from "lib/types/tsdb";

export class InfluxConfigurationBody {
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

export interface InfluxConfiguration {
    url: string;
    token: string;
    org: string;
    bucket: string;
    appId: number;
    connStatus: CONNECTION_STATUS;
}
