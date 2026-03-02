import { IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  user_id: string;

  @IsString()
  conversation_type: string;

  @IsString()
  input_text: string;
}
