import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ObJectScanningRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findChildByUserId(user_id: string) {
    return this.prisma.children.findMany({
      where: { user_id },
      select: { child_id: true },
    });
  }

  async createRecognitionLog(child_id: string, object_name: string) {
    if (!child_id) {
      throw new Error('Child ID required');
    }
    return await this.prisma.object_recognition_logs.create({
      data: {
        child_id: child_id,
        detected_object: object_name,
      },
    });
  }
}
