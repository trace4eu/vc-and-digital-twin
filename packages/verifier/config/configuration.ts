import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export interface ApiConfig {
  corsOrigins: string | undefined;
  apiPort: number;
  apiBasePath: string | undefined;
  authorizationServerPublicKey: string | undefined;
  authorizationServerPrivateKey: string | undefined;
  redisHost: string | undefined;
  redisPort: string | undefined;
  redisPrefix: string | undefined;
  verifierClientId: string | undefined;
  openid4vpRequestProtocol: string | undefined;
  openid4vpRequestObjectExp: number;
  ebsiAuthority: string | undefined;
  ebsiDidResolver: string | undefined;
}

export const loadConfig = (): ApiConfig => {
  return {
    corsOrigins: process.env.CORS_ORIGINS,
    apiPort: parseInt(process.env.API_PORT || '3000', 10),
    apiBasePath: process.env.API_BASE_PATH,
    authorizationServerPublicKey: process.env.AUTHORIZATION_SERVER_PUBLIC_KEY,
    authorizationServerPrivateKey: process.env.AUTHORIZATION_SERVER_PRIVATE_KEY,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPrefix: process.env.REDIS_PREFIX,
    verifierClientId: process.env.VERIFIER_CLIENT_ID,
    openid4vpRequestProtocol: process.env.OPENID4VP_REQUEST_PROTOCOL,
    openid4vpRequestObjectExp: parseInt(
      process.env.OPENID4VP_REQUEST_OBJECT_EXP || '300',
      10,
    ),
    ebsiAuthority: `api-${process.env.EBSI_ENVIRONMENT}.ebsi.eu`,
    ebsiDidResolver: `https://api-${process.env.EBSI_ENVIRONMENT}.ebsi.eu/did-registry/v5/identifiers`,
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
    CORS_ORIGINS: Joi.string().empty().required().default('*'),
    API_PORT: Joi.string().pattern(/^\d+$/).default('3000'),
    API_BASE_PATH: Joi.string().default('/apis/v1'),
    AUTHORIZATION_SERVER_PUBLIC_KEY: Joi.string().empty().required(),
    AUTHORIZATION_SERVER_PRIVATE_KEY: Joi.string().empty().required(),
    REDIS_HOST: Joi.string().empty().required(),
    REDIS_PORT: Joi.string().empty().pattern(/^\d+$/).required(),
    REDIS_PREFIX: Joi.string().empty().required(),
    VERIFIER_CLIENT_ID: Joi.string().empty().required(),
    OPENID4VP_REQUEST_PROTOCOL: Joi.string().default('openid4vp://'),
    OPENID4VP_REQUEST_OBJECT_EXP: Joi.string().pattern(/^\d+$/).default('300'),
    EBSI_ENVIRONMENT: Joi.string().empty().default('pilot'),
  }),
});
