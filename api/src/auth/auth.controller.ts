import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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
  login(@Request() req, @Body() loginDto: loginDto) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    return {
      acces_token: this.authService.generateAccessToken(
        req.user._id,
        req.user.username,
      ),
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(req.user._id, refreshTokenDto.refreshToken);
  }
}
