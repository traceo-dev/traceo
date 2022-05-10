import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import morgan from "morgan";
import { AllExceptionsFilter } from './all-exception.filter';
import { Klepper } from "klepper";
import { KlepperInterceptor } from './interceptors/KlepperInterceptor';

var cors = require('cors');

async function bootstrap() {
  // Klepper.init({
  //   appId: process.env.KLEPPER_APP_ID,
  //   privateKey: process.env.KLEPPER_PRIVATE_KEY,
  //   environment: "dev",
  //   version: "0.0.1"
  // });
  
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Klepper REST API')
    .setVersion('0.0.1')
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
  app.use(morgan("[:date[iso]] :method :url :status :response-time ms"));
  
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.useGlobalInterceptors(new KlepperInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();