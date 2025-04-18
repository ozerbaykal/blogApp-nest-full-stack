import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schemas/user.schemas';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
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
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }
  generateAccessToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username: username,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'accessTokenSecret',
      expiresIn: process.env.JWT_EXPIRATION_TIME || '15m',
    });
  }
  generateRefreshToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username: username,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshTokenSecret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
    });
  }
  generateTokens(userId: string, username: string) {
    const accessToken = this.generateAccessToken(userId, username);
    const refreshToken = this.generateRefreshToken(userId, username);
    return { accessToken, refreshToken };
  }

  login(user: User) {
    const { username, _id } = user; //tokenleri oluştur gönder
    const tokens = this.generateTokens(_id as string, username);
    return tokens;
  }

  refresh(refreshTokenDto: any) {
    return 'refresh';
  }

  logout(logoutDto: any) {
    return 'logout';
  }
}
