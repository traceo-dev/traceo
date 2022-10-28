import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from '../auth/auth.model';
import { Comment } from '../db/entities/comment.entity';
import { AuthRequired } from '../libs/decorators/auth-required.decorator';
import { AuthAccount } from '../libs/decorators/auth-user.decorator';
import { CommentsService } from './comments.service';
import { CommentsQueryService } from './query/comments-query.service';
import { BaseDtoQuery } from '../core/generic.model';
import { PatchCommentDto } from '../types/comments';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryService: CommentsQueryService,
  ) {}

  @Post('/send')
  @AuthRequired()
  async sendComment(
    @Body() comment: PatchCommentDto,
    @AuthAccount() account: RequestUser,
  ): Promise<any> {
    return await this.commentsService.saveComment(comment, account);
  }

  @Patch('/update/:id')
  @AuthRequired()
  async updateComment(
    @Param('id') commentId: string,
    @Body() comment: PatchCommentDto,
  ): Promise<any> {
    return await this.commentsService.updateComment(commentId, comment);
  }

  @Delete('/remove/:id')
  @AuthRequired()
  async removeComment(
    @Param('id') commentId: string,
    @Query("incidentId") incidentId: string,
  ): Promise<any> {
    return await this.commentsService.removeComment(commentId, incidentId);
  }

  @Get()
  @AuthRequired()
  public async getComments(
    @Query("id") id: string,
    @Query() query: BaseDtoQuery,
  ): Promise<Comment[]> {
    return await this.commentsQueryService.listDto({
      incidentId: id,
      ...query
    });
  }
}
