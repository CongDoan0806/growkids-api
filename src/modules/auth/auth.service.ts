import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { JwtHelper } from 'src/common/utils/jwtHelper';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const { accessToken, refreshToken } =
      this.jwtHelper.generateTokenPair(payload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken);
    return {
      accessToken,
      refreshToken,
      childId: user.children?.[0]?.child_id || null,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtHelper.verifyRefreshToken(refreshToken);
      const payload = {
        sub: decoded.sub,
        email: decoded.email,
      };
      const user = await this.authRepository.findByEmail(payload.email);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const isValidRefreshToken = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.jwtHelper.generateAccessToken(payload);
      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async removeRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtHelper.verifyRefreshToken(refreshToken);
      await this.authRepository.removeRefreshToken(payload.sub);
      return {
        message: 'Logout successful',
        success: true,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(
    fullName: string,
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: { id: string; fullName: string; email: string };
  }> {
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.authRepository.createUser(
      fullName,
      email,
      hashedPassword,
    );
    await this.authRepository.createChildren(user.id);
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}
