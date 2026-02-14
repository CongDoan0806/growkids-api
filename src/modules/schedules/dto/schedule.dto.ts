import {
  IsArray,
  IsString,
  Matches,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TimeBlockDto {
  @IsString()
  activity_type: string;

  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'Thời gian phải là định dạng HH:mm',
  })
  start_time: string;

  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'Thời gian phải là định dạng HH:mm',
  })
  end_time: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeBlockDto)
  time_blocks: TimeBlockDto[];
}

export class UserPayload {
  @IsString()
  sub: string; // ID người dùng (UUID)

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  iat?: number;

  @IsOptional()
  @IsNumber()
  exp?: number;
}
