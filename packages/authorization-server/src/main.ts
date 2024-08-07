import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { ApiConfig } from '../config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<ApiConfig, true>>(ConfigService);
  const apiUrlPrefix = configService.get<string>('apiUrlPrefix');
  const port = configService.get<number>('apiPort');

  app.setGlobalPrefix(apiUrlPrefix);
  await app.listen(port);
}
bootstrap();
