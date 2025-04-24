import { UserService } from 'src/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'accessTokenSecret',
    });
  }
  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    //kullanıcı bulunamdıysa hata döndür
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }
    const { password, ...userWithoutPassword } = user.toObject();
    //kullanıcı bulunduysa kullanıcıyı döndür
    return userWithoutPassword;
  }
}
