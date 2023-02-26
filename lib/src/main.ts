import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const cors = require("cors");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("[:date[iso]] :status :method :url :response-time ms"));

    const options = new DocumentBuilder()
      .setTitle("Traceo REST API")
      .setVersion(process.env.VERSION)
      .addServer("/api")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-doc", app, document);
  }

  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cors({ credentials: true, origin: true }));

  app.use(
    compression({
      filter: () => true,
      threshold: 0
    })
  );

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () =>
    console.log(`Application started in ${process.env.NODE_ENV} mode.`)
  );
}
bootstrap();
