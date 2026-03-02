import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { toFile } from 'openai/uploads';

@Injectable()
export class OpenAiSharedService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribe(
    audioBuffer: Buffer,
    fileName: string = 'audio.m4a',
  ): Promise<string> {
    const file = await toFile(audioBuffer, fileName, { type: 'audio/m4a' });
    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });
    return transcription.text;
  }

  async generateJsonResponse<T>(
    systemPrompt: string,
    userContent: string,
  ): Promise<T> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    });
    return JSON.parse(response.choices[0].message.content || '{}') as T;
  }

  async generateSpeech(
    text: string,
    voice: 'shimmer' | 'alloy' | 'echo' = 'shimmer',
  ): Promise<string> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: voice,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
  }
}
