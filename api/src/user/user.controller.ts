import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request as req } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //kullanıcının bilgilerini getir
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: req) {
    //zaten kullanıcının bilgilerini getirmek için gerekli olan guard req.user içinde kullanıcıyı döndürüyor

    return req.user;
  }
  //kullanıcıyı güncelle
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Request() req: req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user!._id, updateUserDto);
  }
}
