import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';
}
