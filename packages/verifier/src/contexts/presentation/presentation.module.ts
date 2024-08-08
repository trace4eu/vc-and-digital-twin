import { Module } from '@nestjs/common';
import RedisService from '../shared/cache/redis.service';
import { PresentationController } from '../../api/presentation.controller';
import { ConfigService } from '@nestjs/config';
import PresentationService from './services/presentation.service';
import { VerifierSessionRepository } from './infrastructure/verifierSession.repository';

@Module({
  imports: [],
  controllers: [PresentationController],
  providers: [
    RedisService,
    ConfigService,
    PresentationService,
    VerifierSessionRepository,
  ],
})
export class PresentationModule {}
