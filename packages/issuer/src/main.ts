import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<ApiConfig, true>>(ConfigService);
  const apiBasePath = configService.get<string>('apiBasePath');
  const apiPort = configService.get<number>('apiPort');
  app.setGlobalPrefix(apiBasePath);

  const config = new DocumentBuilder()
    .setTitle('Verifiable Credential Issuer')
    .setDescription(
      'With this API EBSI compliant VCs can be issued following OID4VCI protocol (pre-authorized code flow). For more information, see here: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-pre-authorized-code-flow',
    )
    .setVersion('1.0')
    .addTag('OID4VCI (pre-authorized flow)')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(apiBasePath + '/api-docs', app, document);

  await app.listen(apiPort);
}
bootstrap();
