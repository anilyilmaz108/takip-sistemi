import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from './config/database-config/database-config.service';
import cacheConfig from './config/cache-config/cache.config';
import corsConfig from './config/cors-config/cors.config';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    RoleModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [corsConfig, cacheConfig], // cache config buradan global erişilebilir
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
    // useClass: AuthGuard('jwt'),
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
})
export class AppModule {}
