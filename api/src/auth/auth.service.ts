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
  async generateRefreshToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username: username,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshTokenSecret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
    });
    //refresh tokeni db'ye kaydet
    await this.userService.setRefreshToken(userId, refreshToken);

    return refreshToken;
  }
  async generateTokens(userId: string, username: string) {
    const accessToken = this.generateAccessToken(userId, username);
    const refreshToken = await this.generateRefreshToken(userId, username);
    return { accessToken, refreshToken };
  }

  async login(user: User) {
    const { username, _id } = user; //tokenleri oluştur gönder
    const tokens = await this.generateTokens(_id as string, username);
    return {
      user: {
        id: _id,
        username: username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
      ...tokens,
    };
  }

  async refresh(user: any) {
    // JwtRefreshStrategy'den gelen yapı { userId, username } şeklinde
    const userId = user.userId || user._id;
    const username = user.username;

    // Yeni tokenlar oluştur
    const tokens = await this.generateTokens(userId, username);

    return {
      ...tokens,
      user: {
        id: userId,
        username: username,
      },
    };
  }

  async logout(userId: string, refreshTokenDto: string) {
    await this.userService.removeRefreshToken(userId);

    return {
      message: 'Çıkış yapıldı',
    };
  }
}
