import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'] ?? 'rms-dev-secret',
    });
  }

  async validate(payload: { sub: number; email: string; role: string; restaurantId: number }) {
    return { userId: payload.sub, email: payload.email, role: payload.role, restaurantId: payload.restaurantId };
  }
}
