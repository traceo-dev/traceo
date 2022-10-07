import { Type } from "class-transformer";
import { IsString } from "class-validator";

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
