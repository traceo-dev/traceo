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
import { AuthRequired } from '../helpers/decorators/auth-required.decorator';
import { AuthAccount } from '../helpers/decorators/auth-user.decorator';
import { CommentsService } from './comments.service';
import { CommentsQueryService } from './query/comments-query.service';
import { BaseDtoQuery } from '../core/query/generic.model';
import { PatchCommentDto } from '../../lib/types/dto/comment.dto';
import { RequestUser } from '../../lib/types/interfaces/account.interface';
import { IComment } from '../../lib/types/interfaces/comment.interface';
import { ApiResponse } from '../../lib/types/dto/response.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryService: CommentsQueryService,
  ) { }

  @Post('/send')
  @AuthRequired()
  async sendComment(
    @Body() comment: PatchCommentDto,
    @AuthAccount() account: RequestUser,
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.saveComment(comment, account);
  }

  @Patch('/update/:id')
  @AuthRequired()
  async updateComment(
    @Param('id') commentId: string,
    @Body() comment: PatchCommentDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.updateComment(commentId, comment);
  }

  @Delete('/remove/:id')
  @AuthRequired()
  async removeComment(
    @Param('id') commentId: string,
    @Query("incidentId") incidentId: string,
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.removeComment(commentId, incidentId);
  }

  @Get()
  @AuthRequired()
  public async getComments(
    @Query("id") id: string,
    @Query() query: BaseDtoQuery,
  ): Promise<IComment[]> {
    return await this.commentsQueryService.listDto({
      incidentId: id,
      ...query
    });
  }
}
