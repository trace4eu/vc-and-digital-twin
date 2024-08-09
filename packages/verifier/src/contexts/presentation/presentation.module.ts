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

@Module({
  imports: [],
  controllers: [
    PresentationController,
    RequestController,
    PresentationDefinitionController,
  ],
  providers: [
    RedisService,
    ConfigService,
    PresentationService,
    VerifierSessionRepository,
    RequestService,
    PresentationDefinitionService,
  ],
})
export class PresentationModule {}
