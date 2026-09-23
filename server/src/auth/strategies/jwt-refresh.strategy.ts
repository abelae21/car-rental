import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';

function extractRefreshToken(req: Request): string | null {
  // Prefer httpOnly cookie; fall back to Authorization header for API clients.
  if (req?.cookies?.refreshToken) return req.cookies.refreshToken;
  const auth = req?.headers?.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    const refreshToken = extractRefreshToken(req);

    if (!user || !user.refreshTokenHash || !refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
