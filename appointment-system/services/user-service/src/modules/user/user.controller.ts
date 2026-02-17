import { Controller, Post, Body, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto, @Req() req: any) {
    return this.userService.create(body, req.correlationId);
  }
}
