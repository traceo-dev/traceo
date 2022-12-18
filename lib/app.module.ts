import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db/typeorm.config.service';
import { HttpModule } from '@nestjs/axios';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    AuthModule,
    ApiModule,
    CommonModule,
    ProvidersModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../app'),
      serveStaticOptions: {
        cacheControl: true
      }
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
