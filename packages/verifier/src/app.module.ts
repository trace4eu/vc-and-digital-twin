import { Module } from '@nestjs/common';
import { ApiConfigModule } from '../config/configuration';
import { HealthController } from './api/health.controller';
import { DirectPostController } from './api/directPost.controller';
import { PresentationController } from './api/presentation.controller';
import { PresentationDefinitionController } from './api/presentationDefinition.controller';

@Module({
  imports: [ApiConfigModule],
  controllers: [
    HealthController,
    DirectPostController,
    PresentationController,
    PresentationDefinitionController,
  ],
  providers: [],
})
export class AppModule {}
