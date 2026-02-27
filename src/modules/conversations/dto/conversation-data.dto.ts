import { IsString, IsOptional, IsArray } from 'class-validator';
export class ConversationDataDto {
  @IsString()
  user_id: string;

  @IsString()
  conversation_type: string;

  @IsString()
  input_text: string;

  @IsString()
  output_text: string;

  @IsOptional()
  @IsString()
  phonetic?: string;

  @IsOptional()
  suggestions?: string[];

  @IsOptional()
  @IsString()
  audioBase64?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suggestionAudioBase64?: string[];
}
