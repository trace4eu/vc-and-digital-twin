import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<ApiConfig, true>>(ConfigService);
  const apiBasePath = configService.get<string>('apiBasePath');
  const apiPort = configService.get<number>('apiPort');
  app.setGlobalPrefix(apiBasePath);

  const config = new DocumentBuilder()
    .setTitle('Authentication Server')
    .setDescription(
      'With this API VC can be issued using the pre-authorized code flow.',
    )
    .setVersion('1.0')
    .addTag('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiBasePath + '/api-docs', app, document);

  await app.listen(apiPort);
}
bootstrap();
