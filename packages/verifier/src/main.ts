import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { ApiConfig } from '../config/configuration';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './api/interceptors/logging.interceptor';
import AllExceptionsFilter from './api/filters/allExceptions.filter';
import getLogLevels from '../config/getLogLevel';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  const configService = app.get<ConfigService<ApiConfig, true>>(ConfigService);
  const apiBasePath = configService.get<string>('apiBasePath');
  const port = configService.get<number>('apiPort');

  app.enableCors({
    origin: [configService.get<string>('corsOrigins')],
  });
  app.setGlobalPrefix(apiBasePath);

  const config = new DocumentBuilder()
    .setTitle('Trace4EU - Verifier')
    .setDescription('Verifier based on OIDC4VP')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(port);
}
bootstrap();
