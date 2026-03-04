import { IsNotEmpty, IsString } from 'class-validator';

export class ScanningObjectDto {
  @IsNotEmpty()
  @IsString()
  imageBase64: string;
}
