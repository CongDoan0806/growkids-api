import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAiSharedService } from 'src/common/ai/ai.service';
import { toFile } from 'openai/uploads';
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  constructor(
    private readonly configService: ConfigService,
    private readonly openAiSharedService: OpenAiSharedService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateSentences(
    topic: string,
    quantity: number,
    goal: string,
  ): Promise<{
    topic: {
      topic_name: string;
      icon: string;
    };
    sentences: Array<{
      sentence_text: string;
      meaning: string;
      phonetic: string;
      level: string;
      audio_url: string | null;
    }>;
  }> {
    try {
      const sentencePrompt = this.buildSentencePrompt(topic, quantity, goal);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an English teacher creating simple, practical sentences for children learning English. Provide sentences with Vietnamese translations and IPA phonetics.',
          },
          {
            role: 'user',
            content: sentencePrompt,
          },
        ],
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Failed to generate sentences', error);
      throw new InternalServerErrorException('Failed to generate sentences');
    }
  }

  private buildSentencePrompt(
    topic: string,
    quantity: number,
    goal: string,
  ): string {
    return `
Create ${quantity * 3} English speaking sentences about "${topic}" for young children (ages 3-8).

Goal: ${goal}

REQUIREMENTS:
- Use simple, child-friendly English that kids can say naturally
- Create EXACTLY ${quantity} sentences for EACH level (Easy, Medium, Advanced)
- Total: ${quantity} Easy + ${quantity} Medium + ${quantity} Advanced = ${quantity * 3} sentences
- All sentences should be in PRESENT TENSE or PRESENT CONTINUOUS (what kids say NOW)
- Focus on everyday situations children experience
- Use first-person perspective (I, We, My) when appropriate
- Provide Vietnamese translation for each sentence
- Include accurate IPA phonetic transcription
- Make sentences practical for real conversations

LEVEL GUIDELINES:
- Easy: 3-5 words, simple present tense, basic daily actions
  Examples: "I like apples", "This is my toy", "I am happy"
  
- Medium: 5-8 words, present continuous, describing current actions
  Examples: "I am playing with my friend", "My mom is cooking dinner"
  
- Advanced: 8-12 words, compound sentences, expressing feelings/opinions
  Examples: "I want to go to the park because it's sunny", "My favorite color is blue and I like drawing"

CONTEXT: Children will use these sentences to:
- Talk about what they're doing right now
- Describe things around them
- Express their feelings and preferences
- Communicate with family and friends

Return STRICTLY in this JSON format:

{
  "topic": {
    "topic_name": "${topic}",
    "icon": "relevant emoji"
  },
  "sentences": [
    {
      "sentence_text": "English sentence here",
      "meaning": "Vietnamese translation here",
      "phonetic": "/IPA phonetic transcription/",
      "level": "Easy",
      "audio_url": null
    }
  ]
}
`;
  }

  async evaluatePronunciation(
    sentence: string,
    userAudioBuffer: Buffer,
  ): Promise<{
    transcribedText: string;
    accuracy: number;
    feedback: string;
  }> {
    try {
      const transcribedText = await this.transcribeSpeech(
        userAudioBuffer,
        'pronunciation.m4a',
      );

      const systemPrompt = `You are a strict English pronunciation evaluator for children.
Compare the expected English sentence with what was transcribed.

STRICT RULES:
- If transcribed text is in a different language (not English), accuracy = 0
- If words are completely different, accuracy = 0-30
- If some words match but pronunciation is off, accuracy = 40-60
- If most words match with minor errors, accuracy = 70-85
- If nearly perfect, accuracy = 90-100

Be honest and strict in evaluation. Children need accurate feedback to improve.`;

      const userContent = `
Expected sentence (English): "${sentence}"
What was transcribed: "${transcribedText}"

Analyze:
1. Is the transcribed text in English?
2. How many words match?
3. Calculate accurate percentage based on word matching and pronunciation quality.

Return in JSON format:
{
  "accuracy": 0-100,
  "feedback": "Feedback in Vietnamese for children"
}`;

      const evaluation = await this.openAiSharedService.generateJsonResponse<{
        accuracy: number;
        feedback: string;
      }>(systemPrompt, userContent);

      return {
        transcribedText,
        accuracy: evaluation.accuracy,
        feedback: evaluation.feedback,
      };
    } catch (error) {
      this.logger.error('Failed to evaluate pronunciation', error);
      throw new InternalServerErrorException(
        'Failed to evaluate pronunciation',
      );
    }
  }

  async transcribeSpeech(
    audioBuffer: Buffer,
    fileName: string = 'audio.m4a',
  ): Promise<string> {
    const file = await toFile(audioBuffer, fileName, { type: 'audio/m4a' });
    const transcription = await this.openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });
    return transcription.text;
  }
}
