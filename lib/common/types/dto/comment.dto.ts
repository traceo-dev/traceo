import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { BaseDtoQuery } from "lib/common/base/query/base-query.model";

export class CommentDto {
    @Type(() => String)
    @IsString()
    readonly incidentId: string;

    @Type(() => String)
    @IsString()
    readonly applicationId: string;
}

export class PatchCommentDto extends CommentDto {
    @Type(() => String)
    @IsString()
    readonly message: string;
}

export class GetCommentsDto extends BaseDtoQuery {
    @IsString()
    @IsOptional()
    readonly incidentId: string;
}
