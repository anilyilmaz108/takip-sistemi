import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [PassportModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, RolesGuard],
})
export class AppModule {}
