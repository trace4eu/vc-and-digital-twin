export interface CacheService<T> {
  save(cacheKeyValue: T): Promise<void>;
  getByKey(key: string): Promise<T>;
  delete(key: string): Promise<void>;
}
