import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from '../config/configuration';

@Module({
  imports: [ApiConfigModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
