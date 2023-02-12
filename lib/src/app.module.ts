import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { RequestContextMiddleware } from './common/middlewares/request-context/request-context.middleware';

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
      rootPath: join(__dirname, '../../public/packages/app/public'),
      serveStaticOptions: {
        cacheControl: true
      }
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .exclude(
        { path: "/api/worker/(.*)", method: RequestMethod.ALL },
        { path: "/api/auth/login", method: RequestMethod.POST })
      .forRoutes({
        path: "*",
        method: RequestMethod.ALL
      });
  }
}
