import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'BU kullanıcı adı veya email adresiyle zaten mevcut',
        );
      }
      throw new BadRequestException('Kullanıcı oluşturma hatası');
    }
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
