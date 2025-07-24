import { CacheItem, CacheStats } from './types';

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private hitCount = 0;
  private missCount = 0;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Set up automatic cleanup every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.missCount++;
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Clean up expired items
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired items`);
    }
  }

  // Get cache size
  getSize(): number {
    return this.cache.size;
  }

  // Get cache keys
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Destroy the cache service (cleanup intervals)
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const cacheService = new CacheService(); 