import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { HttpModule } from '@nestjs/axios';
import { AccountQueryService } from 'src/account/account-query/account-query.service';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [GithubService, AccountQueryService],
  controllers: [GithubController]
})
export class GithubModule {}
