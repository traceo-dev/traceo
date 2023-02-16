import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../common/decorators/auth-guard.decorator';
import { GetCommentsDto, PatchCommentDto } from '../../../common/types/dto/comment.dto';
import { ApiResponse } from '../../../common/types/dto/response.dto';
import { IComment } from '@traceo/types';
import { IncidentCommentsService } from './incident-comments.service';
import { IncidentCommentsQueryService } from './query/incident-comments-query.service';

@ApiTags('comments')
@Controller('comments')
@UseGuards(new AuthGuard())
export class IncidentCommentsController {
  constructor(
    private commentsService: IncidentCommentsService,
    private commentsQueryService: IncidentCommentsQueryService,
  ) { }

  @Post('/send')
  async sendComment(
    @Body() comment: PatchCommentDto
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.saveComment(comment);
  }

  @Patch('/update/:id')
  async updateComment(
    @Param('id') commentId: string,
    @Body() comment: PatchCommentDto,
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.updateComment(commentId, comment);
  }

  @Delete('/remove/:id')
  async removeComment(
    @Param('id') commentId: string,
    @Query("incidentId") incidentId: string,
  ): Promise<ApiResponse<unknown>> {
    return await this.commentsService.removeComment(commentId, incidentId);
  }

  @Get()
  public async getComments(
    @Query("id") id: string,
    @Query() query: GetCommentsDto,
  ): Promise<ApiResponse<IComment[]>> {
    return await this.commentsQueryService.getApiListDto({
      incidentId: id,
      ...query
    });
  }
}
