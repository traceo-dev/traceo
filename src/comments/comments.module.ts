import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PassportModule } from '@nestjs/passport';
import { MongodbModule } from 'src/db/mongodb.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongodbModule
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
