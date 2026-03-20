import {
  IsUrl,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminFetchYoutubeDto {
  @IsUrl()
  video_url: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  manual_text?: string;
}

export class AdminLyricItemDto {
  @IsNumber()
  line_order: number;

  @IsString()
  lyric_text: string;

  @IsNumber()
  start_time: number;

  @IsOptional()
  @IsString()
  phonetic?: string;
}

export class AdminCreateFullSongDto {
  @IsString()
  title: string;

  @IsUrl()
  video_url: string;

  @IsString()
  thumbnail: string;

  @IsNumber()
  duration: number;

  @IsString()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminLyricItemDto)
  lyrics: AdminLyricItemDto[];
}
