import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController, AppController],
  providers: [AppService],
})
export class AppModule {}
