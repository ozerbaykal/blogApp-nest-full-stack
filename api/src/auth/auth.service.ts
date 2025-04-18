import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  register(createUserDto: CreateUserDto) {
    return 'register';
  }

  login(loginDto: any) {
    return 'login';
  }

  refresh(refreshTokenDto: any) {
    return 'refresh';
  }

  logout(logoutDto: any) {
    return 'logout';
  }
}
