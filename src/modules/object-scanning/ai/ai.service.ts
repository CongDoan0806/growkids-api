import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAiSharedService } from 'src/common/ai/ai.service';

@Injectable()
export class AIService {
  private readonly openai: OpenAI;

  constructor(private readonly openAiSharedService: OpenAiSharedService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async identifyObject(imageBase64: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a friendly bilingual educational assistant for kids. Return JSON only.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and identify the main object. Return a JSON:
                                {
                                    "nameEn": "English name",
                                    "nameVi": "Tên tiếng Việt",
                                    "phonetic": "IPA for the name",
                                    "example": "A simple English sentence",
                                    "suggestion": {
                                        "textEn": "An encouraging English suggestion for the child",
                                        "textVi": "Câu gợi ý đó bằng tiếng Việt",
                                        "phonetic": "Full IPA pronunciation for the English suggestion"
                                    }
                                }
                                Note: The suggestion should encourage the child to interact with the object, like: 'Can you draw this apple?' or 'Let's count how many apples there are!'`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data')
                    ? imageBase64
                    : `data:image/webp;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      throw new Error('Failed to recognize object. Please try again.');
    }
  }

  async getFullRecorgnitionResult(imageBase64: string) {
    const visionData = await this.identifyObject(imageBase64);
    const audioName = await this.openAiSharedService.generateSpeech(
      visionData.nameEn,
      'alloy',
    );

    let audioSuggestion = null;
    if (visionData.suggestion && visionData.suggestion.textEn) {
      audioSuggestion = await this.openAiSharedService.generateSpeech(
        visionData.suggestion.textEn,
        'alloy',
      );
    }

    return {
      ...visionData,
      audioNameBase64: audioName,
      audioSuggestionBase64: audioSuggestion,
    };
  }
}
