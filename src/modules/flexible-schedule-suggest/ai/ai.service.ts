import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { routine_time_blocks } from '@prisma/client';
import OpenAI from 'openai';
import { FlexibleSlotDto } from '../dto/flexible-schedule.dto';

@Injectable()
export class FlexibleAiService {
  private readonly logger = new Logger(FlexibleAiService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateReplacementSlot(
    routineTimeBlocks: routine_time_blocks[],
    missedSlotInfo: { start_time: string; slot_type: string },
  ): Promise<FlexibleSlotDto> {
    try {
      const prompt = this.buildFlexiblePrompt(
        routineTimeBlocks,
        missedSlotInfo,
      );

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in child development and schedule optimization. Return ONLY a valid JSON object, no markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanContent) as FlexibleSlotDto;
    } catch (error) {
      this.logger.error('Failed to generate replacement slot', error);
      throw new InternalServerErrorException(
        'Failed to generate replacement slot',
      );
    }
  }

  private buildFlexiblePrompt(
    routineTimeBlocks: routine_time_blocks[],
    missed: { start_time: string; slot_type: string },
  ): string {
    const blocksInfo = routineTimeBlocks
      .map(
        (block) =>
          `- ${block.activity_type}: ${block.start_time} to ${block.end_time}${block.description ? ` (${block.description})` : ''}`,
      )
      .join('\n');

    return `Analyze the following daily routine and suggest a NEW "golden time" slot to replace one that the child has consistently missed.

      Daily Routine:
      ${blocksInfo}

      CONTEXT:
      The child has missed the "${missed.slot_type}" slot at ${missed.start_time} for 3 consecutive days. This indicates this specific time is NOT suitable for the family.

      REQUIREMENTS:
      - Identify a NEW gap between activities that is better suited for the child.
      - The new start_time MUST NOT be ${missed.start_time}.
      - The slot_type should remain "${missed.slot_type}" or be similar.
      - Duration should be 15-60 minutes based on the new available gap.
      - Ensure the new time does not conflict with existing meals, sleep, or other routine blocks.

      Return ONLY a JSON object with this structure (no markdown):

      {
        "slot_type": "${missed.slot_type}",
        "start_time": "HH:mm",
        "duration_minutes": 30,
        "context": "Active outdoor play after lunch"
      }`;
  }
}
