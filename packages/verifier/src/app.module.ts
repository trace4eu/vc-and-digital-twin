import { Module } from '@nestjs/common';
import { ApiConfigModule } from '../config/configuration';
import { HealthController } from './api/health.controller';
import { VerifierController } from './api/verifier.controller';
import { PresentationController } from './api/presentation.controller';
import { PresentationDefinitionController } from './api/presentationDefinition.controller';
import { PresentationModule } from './contexts/presentation/presentation.module';

@Module({
  imports: [ApiConfigModule, PresentationModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
