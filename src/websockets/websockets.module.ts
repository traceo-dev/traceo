import { Module } from '@nestjs/common';
import { CommentsGateway } from './comments.gateway';

@Module({
    providers: [CommentsGateway]
})
export class WebsocketsModule {}
