import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface AIResult {
  vietnamese: string;
  english: string;
  phonetic: string;
  audioBase64?: string;
  suggestions: string[];
  suggestionAudioBase64?: string[];
}

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processText(text: string): Promise<AIResult> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },

      messages: [
        {
          role: 'system',
          content: `
Return JSON format:
{
    "vietnamese": "Dịch văn bản sang tiếng Việt",
    "english": "Corrected or refined English version",
    "phonetic": "IPA pronunciation of the English version",
    "suggestions": ["3 short, fun alternative ways to say this for kids"]
}
`,
        },
        {
          role: 'user',
          content: `Analyze this text: "${text}"`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    const result = JSON.parse(content || '{}') as AIResult;
    result.audioBase64 = await this.generateSpeech(result.english);

    if (result.suggestions && result.suggestions.length > 0) {
      result.suggestionAudioBase64 = await Promise.all(
        result.suggestions.map((msg) => this.generateSpeech(msg)),
      );
    }
    return result;
  }

  async generateSpeech(text: string): Promise<string> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: 'shimmer',
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.toString('base64');
  }
}
