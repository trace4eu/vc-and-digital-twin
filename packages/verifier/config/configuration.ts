import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export interface ApiConfig {
  apiPort: number;
  apiBasePath: string | undefined;
  authorizationServerPublicKey: string | undefined;
  authorizationServerPrivateKey: string | undefined;
  redisHost: string | undefined;
  redisPort: string | undefined;
  redisPrefix: string | undefined;
  verifierClientId: string | undefined;
  verifierPublicUrl: string | undefined;
  openid4vpRequestProtocol: string | undefined;
}

export const loadConfig = (): ApiConfig => {
  return {
    apiPort: parseInt(process.env.API_PORT || '3000', 10),
    apiBasePath: process.env.API_BASE_PATH,
    authorizationServerPublicKey: process.env.AUTHORIZATION_SERVER_PUBLIC_KEY,
    authorizationServerPrivateKey: process.env.AUTHORIZATION_SERVER_PRIVATE_KEY,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPrefix: process.env.REDIS_PREFIX,
    verifierClientId: process.env.VERIFIER_CLIENT_ID,
    verifierPublicUrl: process.env.VERIFIER_PUBLIC_URL,
    openid4vpRequestProtocol: process.env.OPENID4VP_REQUEST_PROTOCOL,
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
    AUTHORIZATION_SERVER_PUBLIC_KEY: Joi.string().empty().required(),
    AUTHORIZATION_SERVER_PRIVATE_KEY: Joi.string().empty().required(),
    REDIS_HOST: Joi.string().empty().required(),
    REDIS_PORT: Joi.string().empty().pattern(/^\d+$/).required(),
    REDIS_PREFIX: Joi.string().empty().required(),
    VERIFIER_CLIENT_ID: Joi.string().empty().required(),
    VERIFIER_PUBLIC_URL: Joi.string().empty().required(),
    OPENID4VP_REQUEST_PROTOCOL: Joi.string().default('openid4vp://'),
  }),
});
