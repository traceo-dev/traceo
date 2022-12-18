import { Module } from '@nestjs/common';
import { GuardsModule } from './guards/guards.module';
import { GuardsService } from './guards/guards.service';
import { CommentsGateway } from './websockets/comments.gateway';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
    imports: [
        GuardsModule,
        WebsocketsModule
    ],
    providers: [
        GuardsService,
        CommentsGateway
    ]
})
export class CommonModule { }
