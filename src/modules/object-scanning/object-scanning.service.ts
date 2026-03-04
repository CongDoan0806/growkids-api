import { Injectable } from '@nestjs/common';
import { AIService } from './ai/ai.service';
import { ObJectScanningRepository } from './object-scanning.repository';

@Injectable()
export class ObjectScanningService {
  constructor(
    private readonly aiService: AIService,
    private readonly objectScanningRepository: ObJectScanningRepository,
  ) {}

  async handleObjectScanning(imageBase64: string, userId: string) {
    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    const childrent =
      await this.objectScanningRepository.findChildByUserId(userId);
    if (!childrent || childrent.length === 0) {
      throw new Error('Child not found for user');
    }
    const childId = childrent[0].child_id;

    const aiResult =
      await this.aiService.getFullRecorgnitionResult(imageBase64);
    if (!aiResult) {
      throw new Error('Failed to identify object');
    }
    await this.objectScanningRepository.createRecognitionLog(
      childId,
      aiResult.nameEn,
    );
    return aiResult;
  }
}
