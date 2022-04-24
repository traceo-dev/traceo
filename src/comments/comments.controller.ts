import { Body, Controller, Get, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { CommentDto } from 'src/db/documents/comments';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { CommentsService } from './comments.service';
import { Comment } from "src/db/documents/comments";

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(
        private commentsService: CommentsService
    ) {}

    @Post('/send')
    @AuthRequired()
    async sendComment(
      @Body() comment: CommentDto,
      @AuthAccount() account: RequestUser,
    ): Promise<any> {
      return await this.commentsService.saveMessage(comment, account);
    }

    @Get()
    @AuthRequired()
    public async getComments(
        @Query("id") id: string,
    ): Promise<Comment[]> {
        return await this.commentsService.getComments(id);
    }
}
