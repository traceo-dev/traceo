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
import { BaseDtoQuery } from '../../../common/base/query/base-query.model';
import { AuthRequired } from '../../../common/decorators/auth-required.decorator';
import { AuthAccount } from '../../../common/decorators/auth-user.decorator';
import { PatchCommentDto } from '../../../common/types/dto/comment.dto';
import { ApiResponse } from '../../../common/types/dto/response.dto';
import { RequestUser } from '../../../common/types/interfaces/account.interface';
import { IComment } from '../../../common/types/interfaces/comment.interface';
import { IncidentCommentsService } from './incident-comments.service';
import { IncidentCommentsQueryService } from './query/incident-comments-query.service';

@ApiTags('comments')
@Controller('comments')
export class IncidentCommentsController {
  constructor(
    private commentsService: IncidentCommentsService,
    private commentsQueryService: IncidentCommentsQueryService,
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
  ): Promise<ApiResponse<IComment[]>> {
    return await this.commentsQueryService.getApiListDto({
      incidentId: id,
      ...query
    });
  }
}
