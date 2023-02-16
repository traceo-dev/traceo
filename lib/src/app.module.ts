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

const staticRootPath = () => {
  if (process.env.NODE_ENV === "production") {
    return join(__dirname, "../app");
  }
  return join(__dirname, '../../public/packages/app/public');
}

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
      rootPath: staticRootPath(),
      serveStaticOptions: {
        cacheControl: true
      }
    })
  ],
  controllers: [AppController]
})
export class AppModule { }
