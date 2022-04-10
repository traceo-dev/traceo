import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

interface ResizeParam {
    maxWidth: number;
    maxHeight: number;
}
@Injectable()
export class AWSBucketService {
    private _client: AWS.S3;

    private get client() {
        if (!this._client) {
            const AwsConfig = {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
                params: {
                    Bucket: process.env.AWS_BUCKET_NAME,
                },
                apiVersion: '2006-03-01'
            };
            this._client = new AWS.S3(AwsConfig);
        }

        return this._client;
    }

    public async putObjectToBucket(
        file: Express.Multer.File,
        bucketName: string,
        keyName: string,
        resize?: ResizeParam,
    ): Promise<void> {
        const isImage = [
            'image/jpeg',
            'image/png',
            'image/bmp',
            'image/gif',
        ].includes(file.mimetype);
        const buffer =
            resize && isImage
                ? await sharp(file.buffer)
                    .resize(resize.maxWidth, resize.maxHeight, {
                        fit: sharp.fit.inside,
                        withoutEnlargement: true,
                    })
                    .toBuffer()
                : file.buffer;

        await this.client
            .putObject({
                Bucket: bucketName,
                Key: keyName,
                Body: buffer,
                ACL: 'private',
                ContentType: file.mimetype,
            })
            .promise();
    }

    public async getObject(url: string, bucketName: string): Promise<Buffer> {
        const data = await this.client
            .getObject({
                Bucket: bucketName,
                Key: url.replace(`https://${bucketName}.s3.amazonaws.com/`, ''),
            })
            .promise();
        return data.Body as Buffer;
    }

    public async uploadImage(
        file: Express.Multer.File,
        bucketName: string,
        resize?: ResizeParam,
    ) {
        const ext = file.originalname.includes('.')
            ? `.${file.originalname.split('.').pop()}`
            : '';
        const keyName = `attachments/${uuid()}${ext}`;
        await this.putObjectToBucket(file, bucketName, keyName, resize);
        return `https://${bucketName}.s3.amazonaws.com/${keyName}`;
    }

    public async removeFileFromBucket(bucketName: string, keyName: string) {
        const params = {
            Bucket: bucketName,
            Key: keyName,
        };
        return await this.client.deleteObject(params).promise();
    }
}
