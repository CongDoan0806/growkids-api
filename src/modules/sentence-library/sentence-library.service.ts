import { Injectable } from '@nestjs/common';
import { SentenceLibraryRepository } from './sentence-library.repository';
import { AiService } from './ai/ai.service';
import { OpenAiSharedService } from 'src/common/ai/ai.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { SentencePayloadDto } from './dto/sentence-payload.dto';

@Injectable()
export class SentenceLibraryService {
  constructor(
    private readonly sentenceLibraryRepository: SentenceLibraryRepository,
    private readonly aiService: AiService,
    private readonly commonAiService: OpenAiSharedService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  getTopics(childId: string) {
    try {
      return this.sentenceLibraryRepository.getTopics(childId);
    } catch {
      throw new Error('Failed to retrieve topics');
    }
  }

  getSentencesByTopic(childId: string, topicId: string) {
    try {
      return this.sentenceLibraryRepository.getSentencesByTopic(
        childId,
        topicId,
      );
    } catch {
      throw new Error('Failed to retrieve sentences');
    }
  }

  async createSentence(dto: SentencePayloadDto) {
    const { topic, quantity, goal, childId } = dto;

    const existingTopic =
      await this.sentenceLibraryRepository.findTopicByName(topic);

    const levels = await this.sentenceLibraryRepository.getLevels();
    const levelMap = {
      Easy: levels.find((l) => l.level_name === 'Easy')?.level_id,
      Medium: levels.find((l) => l.level_name === 'Medium')?.level_id,
      Advanced: levels.find((l) => l.level_name === 'Advanced')?.level_id,
    };

    if (existingTopic) {
      const existingCount =
        await this.sentenceLibraryRepository.countSentencesByTopic(
          existingTopic.topic_id,
        );
      const needed = quantity * 3;

      if (existingCount >= needed) {
        const existingSentences =
          await this.sentenceLibraryRepository.getSentencesByTopicId(
            existingTopic.topic_id,
            needed,
          );
        return this.sentenceLibraryRepository.cloneSentencesForChild(
          existingSentences,
          childId,
        );
      } else {
        const needMore = needed - existingCount;
        const quantityPerLevel = Math.ceil(needMore / 3);
        const aiData = await this.aiService.generateSentences(
          topic,
          quantityPerLevel,
          goal,
        );

        const sentencesWithAudio = await this.processAudio(
          aiData.sentences,
          levelMap,
        );

        await this.sentenceLibraryRepository.createSentences(
          existingTopic.topic_id,
          sentencesWithAudio,
          childId,
        );

        const existingSentences =
          await this.sentenceLibraryRepository.getSentencesByTopicId(
            existingTopic.topic_id,
            existingCount,
          );
        return this.sentenceLibraryRepository.cloneSentencesForChild(
          existingSentences,
          childId,
        );
      }
    } else {
      const aiData = await this.aiService.generateSentences(
        topic,
        quantity,
        goal,
      );

      const newTopic = await this.sentenceLibraryRepository.createTopic(
        aiData.topic,
      );

      const sentencesWithAudio = await this.processAudio(
        aiData.sentences,
        levelMap,
      );

      return this.sentenceLibraryRepository.createSentences(
        newTopic.topic_id,
        sentencesWithAudio,
        childId,
      );
    }
  }

  private async processAudio(sentences: any[], levelMap: any) {
    return Promise.all(
      sentences.map(async (sentence) => {
        const audioBase64 = await this.commonAiService.generateSpeech(
          sentence.sentence_text,
        );
        const audioUrl = await this.cloudinaryService.uploadAudioBase64(
          audioBase64,
          `sentence_${Date.now()}`,
        );

        return {
          ...sentence,
          level_id: levelMap[sentence.level],
          audio_url: audioUrl,
        };
      }),
    );
  }

  async checkPronunciation(
    sentence: string,
    userAudioBuffer: Buffer,
  ): Promise<{
    transcribedText: string;
    accuracy: number;
    feedback: string;
  }> {
    const result = await this.aiService.evaluatePronunciation(
      sentence,
      userAudioBuffer,
    );

    return {
      transcribedText: result.transcribedText,
      accuracy: result.accuracy,
      feedback: result.feedback,
    };
  }
}
