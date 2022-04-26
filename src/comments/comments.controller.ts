import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { CommentDto, PatchCommentDto } from 'src/db/documents/comments';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { CommentsService } from './comments.service';
import { Comment } from "src/db/documents/comments";

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService
  ) { }

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
    @Query("workspaceId") workspaceId: string,
  ): Promise<any> {
    return await this.commentsService.removeComment(commentId, { workspaceId, incidentId });
  }

  @Get()
  @AuthRequired()
  public async getComments(
    @Query("id") id: string,
  ): Promise<Comment[]> {
    return await this.commentsService.getComments(id);
  }
}
