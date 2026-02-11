import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [PassportModule],
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
