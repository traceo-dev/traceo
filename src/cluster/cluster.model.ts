import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClusterModel {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name' })
    public name: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'description' })
    public description: string;
}

export class WorkspaceToCluster {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'clusterId' })
    public clusterId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'clusterId' })
    public workspaceId: string;
}