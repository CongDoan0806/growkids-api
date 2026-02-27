import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface SuggestionItem {
  english: string;
  vietnamese: string;
  phonetic: string;
  audioBase64?: string;
}

export interface AIResult {
  vietnamese: string;
  english: string;
  phonetic: string;
  audioBase64?: string;
  suggestions: SuggestionItem[];
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
    "english": "Corrected English version",
    "phonetic": "IPA pronunciation",
    "suggestions": [
      {
        "english": "Alternative English sentence",
        "vietnamese": "Nghĩa tiếng Việt tương ứng",
        "phonetic": "IPA của câu này"
      }
    ]
}
Note: Suggestions should be short, fun and suitable for kids. Return exactly 3 suggestions.
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

    if (result.suggestions && Array.isArray(result.suggestions)) {
      await Promise.all(
        result.suggestions.map(async (item) => {
          item.audioBase64 = await this.generateSpeech(item.english);
        }),
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
