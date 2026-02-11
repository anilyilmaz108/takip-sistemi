import { Controller, Get, Patch, Param, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.userService.update(id, body);
  }

  @Roles('ADMIN')
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.userService.deactivate(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }
}