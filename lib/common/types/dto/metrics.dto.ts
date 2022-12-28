import { IsArray, IsNotEmpty } from "class-validator";

export class MetricQueryDto {
    @IsArray()
    @IsNotEmpty()
    fields: string[];

    // @IsInt()
    @IsNotEmpty()
    hrCount: number;
}