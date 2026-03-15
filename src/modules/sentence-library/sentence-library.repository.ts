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
      distinct: ['sentence_text'],
      include: { levels: true },
      orderBy: { created_at: 'asc' },
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
      where: { topic_id: topicId },
    });
  }

  getSentencesByTopicId(topicId: string, limit: number) {
    return this.prisma.sentences.findMany({
      where: { topic_id: topicId },
      take: limit,
    });
  }

  createTopic(topicData: { topic_name: string; icon: string }) {
    return this.prisma.topics.create({ data: topicData });
  }

  async createSentences(topicId: string, sentences: any[], childId: string) {
    await this.prisma.sentences.createMany({
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

    return this.prisma.sentences.findMany({
      where: {
        topic_id: topicId,
        child_id: childId,
      },
      include: {
        topics: true,
        levels: true,
      },
      orderBy: { created_at: 'desc' },
      take: sentences.length,
    });
  }

  async cloneSentencesForChild(sentences: any[], childId: string) {
    const beforeCreate = new Date();

    await this.prisma.sentences.createMany({
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

    return this.prisma.sentences.findMany({
      where: {
        child_id: childId,
        created_at: {
          gte: beforeCreate,
        },
      },
      include: {
        topics: true,
        levels: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
