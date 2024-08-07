import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export interface ApiConfig {
  apiPort: number;
  apiBasePath: string | undefined;
  authorizationServerPublicKey: string | undefined;
  authorizationServerPrivateKey: string | undefined;
  callbackUrl: string | undefined;
}

export const loadConfig = (): ApiConfig => {
  return {
    apiPort: parseInt(process.env.API_PORT || '3000', 10),
    apiBasePath: process.env.API_BASE_PATH,
    authorizationServerPublicKey: process.env.AUTHORIZATION_SERVER_PUBLIC_KEY,
    authorizationServerPrivateKey: process.env.AUTHORIZATION_SERVER_PRIVATE_KEY,
    callbackUrl: process.env.CALLBACK_URL,
  };
};

export const ApiConfigModule = ConfigModule.forRoot({
  envFilePath: [
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env.local',
    '.env',
  ],
  load: [loadConfig],
  validationSchema: Joi.object({
    API_PORT: Joi.string().default('3000'),
    API_BASE_PATH: Joi.string(),
    AUTHORIZATION_SERVER_PUBLIC_KEY: Joi.string().required(),
    AUTHORIZATION_SERVER_PRIVATE_KEY: Joi.string().required(),
    CALLBACK_URL: Joi.string().empty('')
  }),
});
