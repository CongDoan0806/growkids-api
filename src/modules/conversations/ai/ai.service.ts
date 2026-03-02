import { Injectable } from '@nestjs/common';
import { OpenAiSharedService } from 'src/common/ai/ai.service';

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
  constructor(private readonly openAiShared: OpenAiSharedService) {}

  async processText(text: string): Promise<AIResult> {
    const systemPrompt = `
      You are an expert linguistic educator for the "GrowKids" EdTech app. 
      Your goal is to analyze the user's input and return a structured JSON object for language learning.

      STRICT RULES:
      1. "vietnamese": Translate the input into natural, child-friendly Vietnamese.
      2. "english": Correct the user's input into standard English. If it's already correct, keep it.
      3. "phonetic": Provide the EXACT International Phonetic Alphabet (IPA) for the "english" field. 
        - DO NOT provide Vietnamese phonetics. 
        - Example for "Hello": "/həˈləʊ/".
      4. "suggestions": Provide exactly 3 alternative ways to say the same thing in English. 
        - They must be short, fun, and suitable for children.
        - Each suggestion must include its own "english", "vietnamese", and "phonetic" (IPA).

      OUTPUT FORMAT (JSON ONLY):
      {
        "vietnamese": "string",
        "english": "string",
        "phonetic": "string",
        "suggestions": [
          { "english": "string", "vietnamese": "string", "phonetic": "string" },
          { "english": "string", "vietnamese": "string", "phonetic": "string" },
          { "english": "string", "vietnamese": "string", "phonetic": "string" }
        ]
      }

      Note: Ensure all IPA symbols are standard and accurate for the English language.
      `;

    const result = await this.openAiShared.generateJsonResponse<AIResult>(
      systemPrompt,
      `Analyze this text: "${text}"`,
    );

    result.audioBase64 = await this.openAiShared.generateSpeech(result.english);

    if (result.suggestions && Array.isArray(result.suggestions)) {
      await Promise.all(
        result.suggestions.map(async (item) => {
          item.audioBase64 = await this.openAiShared.generateSpeech(
            item.english,
          );
        }),
      );
    }

    return result;
  }
}
