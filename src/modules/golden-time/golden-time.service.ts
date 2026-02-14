import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { routine_time_blocks } from '@prisma/client';
import OpenAI from 'openai';
import { GoldenTimeRepository } from './golden-time.repository';
import { GoldenTimeSlotDto } from './dto/golden-time-slot.dto';

@Injectable()
export class GoldenTimeService {
  private readonly logger = new Logger(GoldenTimeService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly goldenTimeRepository: GoldenTimeRepository,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async createGoldenTimeSlot(childId: string) {
    const routineTimeBlocks =
      await this.goldenTimeRepository.findRoutineTimeBlocks(childId);

    if (routineTimeBlocks.length === 0) {
      throw new InternalServerErrorException(
        'No routine time blocks found for the child',
      );
    }

    const generatedSlots =
      await this.generateGoldenTimeSlots(routineTimeBlocks);

    return {
      routineId: routineTimeBlocks[0].routine_id,
      slots: generatedSlots,
    };
  }

  private async generateGoldenTimeSlots(
    routineTimeBlocks: routine_time_blocks[],
  ): Promise<GoldenTimeSlotDto[]> {
    try {
      const prompt = this.buildPrompt(routineTimeBlocks);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in child development and creating engaging activities for children during their free time. Return ONLY a valid JSON array, no markdown formatting.',
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
      return JSON.parse(cleanContent) as GoldenTimeSlotDto[];
    } catch (error) {
      this.logger.error('Failed to generate golden time slots', error);
      throw new InternalServerErrorException(
        'Failed to generate golden time slots',
      );
    }
  }

  private buildPrompt(routineTimeBlocks: routine_time_blocks[]): string {
    const blocksInfo = routineTimeBlocks
      .map(
        (block) =>
          `- ${block.activity_type}: ${block.start_time} to ${block.end_time}${block.description ? ` (${block.description})` : ''}`,
      )
      .join('\n');

    return `Analyze the following daily routine and identify 3-5 optimal "golden time" slots for a child's development activities.

      Daily Routine:
      ${blocksInfo}

      Requirements:

      - Identify gaps between activities that are suitable for learning/play
      - Vary slot types: "play", "learning", "creative", "physical", "quiet_time"
      - Duration should be 15-60 minutes based on the available time gap
      - Consider child's energy levels (morning = high energy, evening = calm activities)
      - Avoid slots right before meals or sleep time

      For each golden time slot:
      - Suggest EXACTLY 2 activities from this list ONLY:
        ["Interactive story", "Mini song", "Object Scanning", "Voice Recording"]
      - Suggestions must be relevant to the slot_type and context
      - Do NOT invent new activity names
      - Always return 2 items in the suggestions array

      Return ONLY a JSON array with this structure (no markdown):

      [
        {
          "slot_type": "play",
          "start_time": "14:00",
          "duration_minutes": 45,
          "context": "Active outdoor play after lunch",
          "suggestions": ["Interactive story", "Mini song"]
        }
      ]`;
  }

  async saveGoldenTimeSlots(
    routineId: string,
    goldenTimes: GoldenTimeSlotDto[],
  ) {
    if (!goldenTimes || goldenTimes.length === 0) return [];

    return await Promise.all(
      goldenTimes.map((slot) =>
        this.goldenTimeRepository.createGoldenTimeSlot(
          routineId,
          slot.slot_type,
          slot.start_time,
          slot.duration_minutes,
          slot.context,
        ),
      ),
    );
  }
}
