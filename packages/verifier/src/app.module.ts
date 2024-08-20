import { Module } from '@nestjs/common';
import { ApiConfigModule } from '../config/configuration';
import { HealthController } from './api/health.controller';
import { PresentationModule } from './contexts/presentation/presentation.module';

@Module({
  imports: [ApiConfigModule, PresentationModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
