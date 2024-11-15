import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import RedisService from '../../shared/cache/redis.service';
import { SessionId } from '../domain/sessionId';
import { VerifierSession } from '../domain/verifierSession';
import { CacheService } from '../../shared/cache/cache.service';

@Injectable()
export class VerifierSessionRepository
  implements CacheService<VerifierSession>
{
  redis: Redis;

  constructor(redisService: RedisService) {
    this.redis = redisService.getClient();
  }
  async getByKey(key: string): Promise<VerifierSession | undefined> {
    const cachedValue = await this.redis.get(
      this.addLocalPrefix(new SessionId(key)),
    );
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
