import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      // tokenı cookie'den al
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ||
        'default_another_secret',
    });
  }

  async validate(
    req: { body: { refreshToken: any } },
    payload: { sub: string; username: any },
  ) {
    const refreshToken = req.body.refreshToken;
    const user = await this.userService.findById(payload.sub);

    // Kullanıcı veritabanında yoksa veya refresh token yoksa hata ver
    // Hash'lenmiş token ile doğrudan karşılaştırma yapmıyoruz!
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }

    return { userId: payload.sub, username: payload.username };
  }
}
