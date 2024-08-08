import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../../../../config/configuration';

@Injectable()
export default class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private readonly redisHost: string;
  private readonly redisPort: number;
  private readonly redisPrefix: string;

  constructor(private configService: ConfigService<ApiConfig, true>) {
    this.redisHost = this.configService.get<string>('redisHost');
    this.redisPort = Number(this.configService.get<string>('redisPort'));
    this.redisPrefix = this.configService.get<string>('redisPrefix');
  }
  onModuleInit() {
    this.initialize();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      return this.redis.disconnect();
    }
    return new Promise((resolve) => resolve());
  }

  private initialize() {
    if (this.redis) return;

    this.redis = new Redis({
      host: this.redisHost,
      port: this.redisPort,
      keyPrefix: this.redisPrefix,
    });
  }

  getClient(): Redis {
    if (!this.redis) {
      this.initialize();
    }
    return this.redis;
  }
}
