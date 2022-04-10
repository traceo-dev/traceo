import {
    Injectable,
    Logger,
    NotAcceptableException,
    NotFoundException,
} from '@nestjs/common';
import { RequestUser } from 'src/auth/auth.model';
import { Attachment, AttachmentType } from 'src/db/entities/attachment.entity';
import { NotFoundError } from 'src/helpers/errors';
import { EntityManager } from 'typeorm';
import { AWSBucketService } from '../awsbucket/awsbucket.service';


const defaultAttachmentBucket =
    process.env.AWS_BUCKET_NAME || 'workspace-bucket-test';

@Injectable()
export class AttachmentsService {
    constructor(
        private readonly attachmentBucket: AWSBucketService,
        private readonly entityManager: EntityManager,
    ) { }

    public async getAttachmentById(attachmentId: string): Promise<Attachment> {
        const attachment = await this.entityManager
            .getRepository(Attachment)
            .findOne({
                where: {
                    id: attachmentId
                }
            });

        if (!attachment) {
            throw new NotFoundError('Attachment not found.');
        }
        return attachment;
    }

    async renderFile(attachmentId: string): Promise<string> {
        const attachment = await this.getAttachmentById(attachmentId);

        const attachmentData = await this.attachmentBucket.getObject(
            attachment.url,
            defaultAttachmentBucket,
        );

        return `data:${attachment.mimetype};base64,${attachmentData.toString(
            'base64',
        )}`;
    }

    async saveFile(
        file: Express.Multer.File,
        account: RequestUser,
        type: AttachmentType,
        metadata?: string,
    ): Promise<{
        success: boolean;
        url: string;
        id: string;
    }> {
        try {
            const { bucketKey, url } = await this.attachmentBucket.uploadImage(
                file,
                defaultAttachmentBucket,
                { maxWidth: 780, maxHeight: 560 },
                type
            );
            const { originalname, size, mimetype } = file;
            const attachment = new Attachment();
            attachment.accountId = account?.id;
            attachment.filename = originalname;
            attachment.mimetype = mimetype;
            attachment.size = size;
            attachment.type = type;
            attachment.url = url;
            attachment.bucketKey = bucketKey;
            attachment.metadata = metadata;
            const { id } = await this.entityManager.save(attachment);

            return { success: true, url, id };
        } catch (error) {
            // eslint-disable-next-line no-console
            Logger.error(`[${this.saveFile.name}] Caused by: ${error}`)
            throw new NotAcceptableException(error.message);
        }
    }
}
