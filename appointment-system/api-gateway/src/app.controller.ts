import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** @Get()
  getHello(): string {
    return this.appService.getHello();
  } */

  @Get('public')
  getPublic() {
    return 'Public endpoint';
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  getAdmin() {
    return 'Admin endpoint';
  }
}
