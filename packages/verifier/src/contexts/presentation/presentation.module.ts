import { Module } from '@nestjs/common';
import RedisService from '../shared/cache/redis.service';
import { PresentationController } from '../../api/presentation.controller';
import { ConfigService } from '@nestjs/config';
import PresentationService from './services/presentation.service';
import { VerifierSessionRepository } from './infrastructure/verifierSession.repository';
import { RequestController } from '../../api/request.controller';
import RequestService from './services/request.service';
import { PresentationDefinitionController } from '../../api/presentationDefinition.controller';
import PresentationDefinitionService from './services/presentationDefinition.service';
import { VerifierController } from '../../api/verifier.controller';
import IdTokenService from './services/idToken.service';
import VpTokenService from './services/vpToken.service';
import { VpValidatorWrapper } from '../shared/middleware/vpValidatorWrapper';
import { DidJwtWrapper } from '../shared/middleware/didJwtWrapper';
import ResolverFactory from '../shared/resolvers/resolverFactory';
import DidKeyResolver from '../shared/resolvers/DidKeyResolver';
import DidEbsiResolver from '../shared/resolvers/DidEbsiResolver';

@Module({
  imports: [],
  controllers: [
    PresentationController,
    RequestController,
    PresentationDefinitionController,
    VerifierController,
  ],
  providers: [
    RedisService,
    ConfigService,
    PresentationService,
    VerifierSessionRepository,
    RequestService,
    PresentationDefinitionService,
    IdTokenService,
    VpTokenService,
    PresentationService,
    VpValidatorWrapper,
    DidEbsiResolver,
    DidKeyResolver,
    DidJwtWrapper,
    ResolverFactory,
  ],
})
export class PresentationModule {}
