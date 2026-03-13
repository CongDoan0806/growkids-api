import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FirebaseService {
  constructor(private readonly httpService: HttpService) {}

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      to: token,
      title,
      body,
      data: data || {},
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post('https://exp.host/--/api/v2/push/send', message, {
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
    data?: any,
  ) {
    const messages = tokens.map((token) => ({
      to: token,
      title,
      body,
      data: data || {},
    }));

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://exp.host/--/api/v2/push/send',
          messages,
          {
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.error('Error sending multicast:', error);
      throw error;
    }
  }
}
