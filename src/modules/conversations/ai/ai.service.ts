import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface AIResult {
  vietnamese: string;
  english: string;
  phonetic: string;
  suggestions: string[];
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

    return JSON.parse(content || '{}') as AIResult;
  }
}
