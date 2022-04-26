import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export interface Comment {
  _id?: string;
  message: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    logo: string;
  };
  createdAt: number;
  lastUpdateAt?: number;
  removed: boolean;
}

export class CommentDto {
  @Type(() => String)
  @IsString()
  readonly incidentId: string;

  @Type(() => String)
  @IsString()
  readonly workspaceId: string;
}

export class PatchCommentDto extends CommentDto {
    @Type(() => String)
    @IsString()
    readonly message: string;
}
