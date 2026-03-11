import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  onModuleInit() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      this.app = admin.app();
    }
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message = {
      notification: { title, body },
      data: data || {},
      token,
    };

    try {
      return await admin.messaging().send(message);
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
    const message = {
      notification: { title, body },
      data: data || {},
      tokens,
    };

    try {
      return await admin.messaging().sendEachForMulticast(message);
    } catch (error) {
      console.error('Error sending multicast:', error);
      throw error;
    }
  }
}
