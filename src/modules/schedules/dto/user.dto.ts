import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
export class UserPayload {
  @IsString()
  sub: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  iat?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;
}
