import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SentenceLibraryRepository {
  constructor(private readonly prisma: PrismaService) {}
  getTopics(childId: string) {
    return this.prisma.topics.findMany({
      where: {
        sentences: {
          some: {
            OR: [{ child_id: childId }, { child_id: null }],
          },
        },
      },
    });
  }
  getSentencesByTopic(childId: string, topicId: string) {
    return this.prisma.sentences.findMany({
      where: {
        topic_id: topicId,
        OR: [{ child_id: childId }, { child_id: null }],
      },
      include: { levels: true },
    });
  }
  createSentence(
    data: {
      topic_id: string;
      level_id: string;
      sentence_text: string;
      meaning: string;
      phonetic: string;
      audio_url?: string;
    },
    childId: string,
  ) {
    return this.prisma.sentences.create({
      data: {
        ...data,
        child_id: childId,
      },
    });
  }
  findTopicByName(topicName: string) {
    return this.prisma.topics.findFirst({
      where: { topic_name: topicName },
    });
  }

  getLevels() {
    return this.prisma.levels.findMany();
  }

  countSentencesByTopic(topicId: string) {
    return this.prisma.sentences.count({
      where: { topic_id: topicId, child_id: null },
    });
  }

  getSentencesByTopicId(topicId: string, limit: number) {
    return this.prisma.sentences.findMany({
      where: { topic_id: topicId, child_id: null },
      take: limit,
    });
  }

  createTopic(topicData: { topic_name: string; icon: string }) {
    return this.prisma.topics.create({ data: topicData });
  }

  createSentences(topicId: string, sentences: any[], childId: string) {
    return this.prisma.sentences.createMany({
      data: sentences.map((s) => ({
        topic_id: topicId,
        level_id: s.level_id,
        child_id: childId,
        sentence_text: s.sentence_text,
        meaning: s.meaning,
        phonetic: s.phonetic,
        audio_url: s.audio_url,
      })),
    });
  }

  cloneSentencesForChild(sentences: any[], childId: string) {
    return this.prisma.sentences.createMany({
      data: sentences.map((s) => ({
        topic_id: s.topic_id,
        level_id: s.level_id,
        child_id: childId,
        sentence_text: s.sentence_text,
        meaning: s.meaning,
        phonetic: s.phonetic,
        audio_url: s.audio_url,
      })),
    });
  }
}
