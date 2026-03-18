import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtHelper } from '../utils/jwtHelper';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No token provided');

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtHelper.verifyAccessToken(token) as any;

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin || admin.status === 'BANNED' || payload.type !== 'ADMIN') {
        throw new UnauthorizedException('You do not have admin access.');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Admin login session');
    }
  }
}
