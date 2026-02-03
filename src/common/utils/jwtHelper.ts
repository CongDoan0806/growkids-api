import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  generateTokenPair(payload: JwtPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
