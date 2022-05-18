import { Module } from '@nestjs/common';
import { AcrService } from './acr.service';
import { AcrController } from './acr.controller';
import { AcrQueryService } from './acr-query/acr-quer.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
  ],
  providers: [AcrService, AcrQueryService],
  controllers: [AcrController]
})
export class AcrModule {}
