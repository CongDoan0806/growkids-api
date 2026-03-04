import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateStory(
    topic: string,
    minAge: number,
    maxAge: number,
    length: number,
    type: string,
    prompt?: string,
  ): Promise<{
    title: string;
    description: string;
    age_min: number;
    age_max: number;
    duration_seconds: number;
    segments: Array<{
      segment_order: number;
      content_text: string;
      interaction_type: string;
    }>;
  }> {
    try {
      const storyPrompt = this.buildStoryPrompt(
        topic,
        minAge,
        maxAge,
        length,
        type,
        prompt,
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              "You are a professional children's story writer who creates safe, educational, and age-appropriate stories. Always ensure content is positive, non-violent, and suitable for young children.",
          },
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
        temperature: 0.8,
      });

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Failed to generate story', error);
      throw new InternalServerErrorException('Failed to generate story');
    }
  }

  async generateImagePrompt(segmentText: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            "Create a short, vivid image prompt for DALL-E based on the story segment. Make it child-friendly, colorful, and suitable for children's books.",
        },
        {
          role: 'user',
          content: `Story segment: ${segmentText}`,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || segmentText;
  }

  private buildStoryPrompt(
    topic: string,
    minAge: number,
    maxAge: number,
    length: number,
    type: string,
    customPrompt?: string,
  ): string {
    const ageGroup =
      minAge === maxAge
        ? `${minAge} years old`
        : `${minAge}-${maxAge} years old`;

    const durationMinutes = Math.floor(length / 60);

    return `
You are a professional children's story writer and educational content designer.

Create an interactive children's story that matches the following specifications:

Topic: ${topic}
Story Type: ${type}
Target Age Group: ${ageGroup}
Target Duration: approximately ${durationMinutes} minutes
${customPrompt ? `Additional Requirements: ${customPrompt}` : ''}

IMPORTANT RULES:
- Use simple, age-appropriate English
- No violence, scary content, or unsafe themes
- Promote kindness, friendship, curiosity, and learning
- Keep sentences short and clear
- Make story suitable for read-aloud audio narration
- Split the story into short segments (5-7 segments total)
- Each segment should be 2-5 sentences only
- Some segments should include simple interactions

INTERACTION TYPES ALLOWED:
- "none"
- "tap"
- "swipe"

Now return the result STRICTLY in the following JSON format.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include extra text.

{
  "title": "Story title",
  "description": "Short 1-2 sentence summary of the story",
  "age_min": ${minAge},
  "age_max": ${maxAge},
  "duration_seconds": ${length},
  "segments": [
    {
      "segment_order": 1,
      "content_text": "Segment text here",
      "interaction_type": "none"
    }
  ]
}
`;
  }
}
