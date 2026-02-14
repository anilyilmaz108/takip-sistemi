import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/common/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() body: User) {
    return this.userService.create(body);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: User,
  ) {
    return this.userService.update(id, body);
  }

  @Roles('ADMIN')
  @Patch(':id/deactivate')
  deactivate(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deactivate(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  @Roles('ADMIN')
  @Patch(':id/restore')
  restore(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.restore(id);
  }
}