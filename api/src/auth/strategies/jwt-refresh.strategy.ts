import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refreshTokenSecret',
      passReqToCallback: true,
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
