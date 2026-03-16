import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBase64(base64Data: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      { folder },
    );
    return result.secure_url;
  }

  async uploadAudioBase64(base64Data: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:audio/mp3;base64,${base64Data}`,
      { folder, resource_type: 'video' },
    );
    return result.secure_url;
  }
}
