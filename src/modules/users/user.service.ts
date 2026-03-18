import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserPayloadDto } from './dto/udate-user-payload.dto';
import { UpdateChildPayloadDto } from './dto/update-child-payload.dto';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getInformationById(userId: string) {
    const userInfo = await this.userRepository.getInformationById(userId);

    if (!userInfo) {
      return null;
    }

    const [totalSentences, totalConversations, totalSongs, totalStories] =
      await Promise.all([
        this.userRepository.getTotalSentencesByUserId(userId),
        this.userRepository.getTotalConversationsByUserId(userId),
        this.userRepository.getTotalSongsLearnedByUserId(userId),
        this.userRepository.getTotalStoriesLearnedByUserId(userId),
      ]);

    const childrenWithStats = await Promise.all(
      (userInfo.children || []).map(async (child) => {
        const [childSentences, childSongs, childStories] = await Promise.all([
          this.userRepository.getTotalSentencesByChildId(child.child_id),
          this.userRepository.getTotalSongsLearnedByChildId(child.child_id),
          this.userRepository.getTotalStoriesLearnedByChildId(child.child_id),
        ]);

        return {
          ...child,
          statistics: {
            totalSentences: childSentences,
            totalSongs: childSongs,
            totalStories: childStories,
            pronunciationScore: null,
          },
        };
      }),
    );

    return {
      user: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        avatar_url: userInfo.avatar_url,
        birth_date: userInfo.birth_date,
        gender: userInfo.gender,
      },
      children: childrenWithStats,
      statistics: {
        totalSentences,
        totalConversations,
        totalSongs,
        totalStories,
        pronunciationScore: null,
      },
    };
  }

  async updateUserInformation(userId: string, user: UpdateUserPayloadDto) {
    let avatar_url = undefined;

    if (user.avatar_base64) {
      avatar_url = await this.cloudinaryService.uploadBase64(
        user.avatar_base64,
        'users/avatars',
      );
    }

    return await this.userRepository.updateUserInformation(
      userId,
      user.fullName,
      user.bird_date,
      user.gender,
      avatar_url,
    );
  }

  async updateChildInfomation(childId: string, child: UpdateChildPayloadDto) {
    let avatar_url = undefined;

    if (child.avatar_base64) {
      avatar_url = await this.cloudinaryService.uploadBase64(
        child.avatar_base64,
        'children/avatars',
      );
    }

    return await this.userRepository.updateChildInfomation(
      childId,
      child.full_name,
      child.birth_date,
      avatar_url,
    );
  }
}
