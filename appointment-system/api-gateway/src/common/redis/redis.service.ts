import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', '127.0.0.1'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () =>
      console.log('✅ Redis connected'),
    );

    this.client.on('error', (err) =>
      console.error('❌ Redis error', err),
    );
  }

  async set(key: string, value: any, ttl?: number) {
    const val = JSON.stringify(value);

    if (ttl) {
      await this.client.set(key, val, 'EX', ttl);
    } else {
      await this.client.set(key, val);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    if (!val) return null;

    try {
      return JSON.parse(val);
    } catch {
      return val as T;
    }
  }

  async del(key: string | string[]) {
    if (Array.isArray(key)) {
      if (key.length) return this.client.del(...key);
      return 0;
    }
    return this.client.del(key);
  }

  async delByPattern(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length) {
      await this.client.del(...keys);
    }
  }

  async flushAll() {
    return this.client.flushall();
  }

  onModuleDestroy() {
    this.client.quit();
  }
}