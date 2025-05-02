import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Request as Req } from 'express';
import { User } from 'src/user/schemas/user.schemas';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  //local strategy kullanıp isim ve şifre doğrulanıyor
  //authservice de tokenleri oluştur geri döndür
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: Req,
    @Res({ passthrough: true }) res,
    @Body() loginDto: loginDto,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      req.user as unknown as User,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000,
    });

    return { user };
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Request() req: Req, @Res({ passthrough: true }) res) {
    const access = this.authService.generateAccessToken(
      req.user!._id,
      req.user!.username,
    );

    res.cookie('access_token', access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60 * 1000,
    });

    return { message: 'Yeni Erişim Tokeni Oluşturuldu' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: Req, @Res({ passthrough: true }) res) {
    console.log('User ID:', req.user!._id); // D
    await this.authService.logout(req.user!._id);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Çıkış yapıldı' };
  }
}
