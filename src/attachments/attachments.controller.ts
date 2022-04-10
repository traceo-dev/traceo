import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/auth.model';
import { AttachmentType } from 'src/db/entities/attachment.entity';
import { AuthRequired } from 'src/decorators/auth-required.decorator';
import { AuthAccount } from 'src/decorators/auth-user.decorator';
import { UploadFileDto } from './attachments.model';
import { AttachmentsService } from './attachments.service';

@ApiTags('attachments')
@Controller('attachments')
export class AttachmentsController {
    constructor(private readonly attachmentService: AttachmentsService) { }

    @Get(':id')
    @AuthRequired()
    async getFile(
        // @AuthAccount() account: RequestUser,
        @Param('id') id: string,
    ) {
        const image = await this.attachmentService.renderFile(id);
        return { image };
    }

    @Post('upload')
    @AuthRequired()
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe({ transform: true }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @AuthAccount() account: RequestUser,
        @Query('type') type: AttachmentType,
        @Body() body: UploadFileDto,
    ): Promise<{
        success: boolean;
        url: string;
        id: string;
    }> {
        return this.attachmentService.saveFile(
            file, account, type, body.metadata
        );
    }
}
