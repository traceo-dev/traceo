import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { AWSBucketService } from 'src/awsbucket/awsbucket.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AttachmentsService, AWSBucketService],
  controllers: [AttachmentsController]
})
export class AttachmentsModule {}
