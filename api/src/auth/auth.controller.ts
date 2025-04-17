import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: any) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: any) {
    return this.authService.refresh(refreshDto);
  }

  @Post('logout')
  logout(@Body() logoutDto: any) {
    return this.authService.logout(logoutDto);
  }
}
