import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as process from 'process';

export interface ApiConfig {
  apiPort: number;
  apiBasePath: string | undefined;
  privateKey: string | undefined;
  serverUrl: string | undefined;
  authServerUrl: string | undefined;
}

export const loadConfig = (): ApiConfig => {
  return {
    apiPort: parseInt(process.env.API_PORT || '3001', 10),
    apiBasePath: process.env.API_BASE_PATH,
    privateKey: process.env.PRIVATE_KEY,
    serverUrl: process.env.SERVER_URL,
    authServerUrl: process.env.AUTH_SERVER_URL,
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
    PRIVATE_KEY: Joi.string().length(64),
    SERVER_URL: Joi.string(),
    AUTH_SERVER_URL: Joi.string(),
  }),
});
