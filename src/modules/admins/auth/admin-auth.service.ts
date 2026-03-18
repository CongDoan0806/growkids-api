import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { JwtHelper } from 'src/common/utils/jwtHelper';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      type: 'ADMIN',
    };

    const { accessToken, refreshToken } =
      this.jwtHelper.generateTokenPair(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
      },
    };
  }

  async removeRefreshToken(adminId: string) {
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken: null },
    });
    return { success: true, message: 'Logout successful' };
  }
}
