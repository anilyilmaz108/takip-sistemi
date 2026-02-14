import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis-yet';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseConfigService } from './config/database-config/database-config.service';

import cacheConfig from './config/cache-config/cache.config';
import corsConfig from './config/cors-config/cors.config';
import { RedisModule } from './common/redis/redis.module';
import { CorrelationIdMiddleware } from './common/middleware/corelation-id.middleware';

@Module({
  imports: [
    PassportModule,
    UserModule,
    RoleModule,
    AuthModule,
    CommonModule,
    DatabaseModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [corsConfig, cacheConfig],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async () => ({
        store: redisStore,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        ttl: 60,
      }),
    }),

    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}