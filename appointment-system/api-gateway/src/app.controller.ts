import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { Public } from './auth/public.decorator';

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

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  getAdmin() {
    return 'Admin endpoint';
  }

  @Public()
  @Get('health')
  healthCheck() {
    return 'OK';
  }

  @Roles('ADMIN')
  @Get('admin-only')
  getAdminData() {
    return 'Only ADMIN can see this';
  }
}
