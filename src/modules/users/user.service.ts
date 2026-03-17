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
    return await this.userRepository.getInformationById(userId);
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
