export interface StoryPayloadDto {
  topic: string;
  minAge: number;
  maxAge: number;
  length: number;
  type: string;
  prompt?: string;
}
