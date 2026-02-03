import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    default: {
      limit: Number(process.env.MAX_AUTH_REQUEST) || 5,
      ttl: Number(process.env.RATE_LIMIT_TTL) || 60000,
    },
  })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  async logout(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ message: string; success: boolean }> {
    return this.authService.removeRefreshToken(dto.refreshToken);
  }
}
