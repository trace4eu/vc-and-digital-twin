import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import RedisService from '../../shared/cache/redis.service';
import { SessionId } from '../domain/sessionId';
import { VerifierSession } from '../domain/verifierSession';

@Injectable()
export class VerifierSessionRepository {
  redis: Redis;

  constructor(redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  async delete(key: SessionId): Promise<void> {
    await this.redis.del(this.addLocalPrefix(key));
  }

  async getByKey(key: SessionId): Promise<VerifierSession | undefined> {
    const cachedValue = await this.redis.get(this.addLocalPrefix(key));
    if (!cachedValue) {
      return undefined;
    }
    return VerifierSession.fromPrimitives(JSON.parse(cachedValue));
  }

  async save(verifierSession: VerifierSession): Promise<void> {
    const cacheValue = JSON.stringify(verifierSession.toPrimitives());
    await this.redis.set(
      this.addLocalPrefix(verifierSession.getSessionId()),
      cacheValue,
      'EX',
      300,
    );
  }

  private addLocalPrefix(sessionId: SessionId): string {
    return 'oidc4vp:' + sessionId.toString();
  }
}
