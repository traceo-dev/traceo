import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import morgan from "morgan";
import { TraceoClient } from "traceo";
import { TraceoInterceptor } from './libs/traceo.interceptor';
import compression from 'compression';

const cors = require("cors");

async function bootstrap() {
  new TraceoClient({
    appId: 35,
    url: process.env.TRACEO_HOST,
    metrics: {
      collect: false,
      interval: 60
    }
  });

  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Traceo REST API')
    .setVersion('2.0.0')
    .addServer('/api', 'Main server - current/local')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cors({ credentials: true, origin: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use(morgan("[:date[iso]] :status :method :url :response-time ms"));

  app.use(compression({
    filter: () => { return true },
    threshold: 0
  }));

  // app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new TraceoInterceptor());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    Logger.log(`Application started on PORT: ${PORT}.`);
    Logger.log(`Application started in ${process.env.NODE_ENV} mode.`);
  });
}
bootstrap();
