import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //kullanıcının bilgilerini getir
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    //zaten kullanıcının bilgilerini getirmek için gerekli olan guard req.user içinde kullanıcıyı döndürüyor

    return req.user;
  }
}
