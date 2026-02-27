import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor";
import { AppLogger } from "./common/logger/app.logger";
import { appValidationPipe } from "./common/pipes/validation.pipe";
import { PrismaService } from "./prisma/prisma.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const config = app.get(ConfigService);
  const frontendOrigin = config.get<string>("FRONTEND_ORIGIN") ?? "http://localhost:3000";
  const port = config.get<number>("PORT") ?? 4001;

  app.enableCors({
    origin: [frontendOrigin],
    credentials: true,
  });

  app.useGlobalPipes(appValidationPipe as ValidationPipe);
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Riffus Backend API")
    .setDescription("Independent modular-monolith Nest backend for Riffus")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  await app.listen(port);
  logger.log(`Riffus backend listening on http://localhost:${port}`, "Bootstrap");
}

bootstrap();
