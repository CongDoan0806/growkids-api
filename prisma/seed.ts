import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('12345678', 10);

  const users = await Promise.all([
    prisma.users.upsert({
      where: { email: 'congdoan@gmail.com' },
      update: {},
      create: {
        fullName: 'Cong Doan',
        email: 'congdoan@gmail.com',
        password: hashedPassword,
        languagePreference: 'vi',
      },
    }),
    prisma.users.upsert({
      where: { email: 'tonga@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Thi To Nga',
        email: 'tonga@gmail.com',
        password: hashedPassword,
        languagePreference: 'vi',
      },
    }),
    prisma.users.upsert({
      where: { email: 'vandat@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Van Dat',
        email: 'vandat@gmail.com',
        password: hashedPassword,
        languagePreference: 'en',
      },
    }),
    prisma.users.upsert({
      where: { email: 'thithuy@gmail.com' },
      update: {},
      create: {
        fullName: 'Nguyen Thi Thuy',
        email: 'thithuy@gmail.com',
        password: hashedPassword,
        languagePreference: 'en',
      },
    }),
  ]);

  const miniSongs = await Promise.all([
    prisma.mini_songs.upsert({
      where: { title: 'Head Shoulders Knees and Toes' },
      update: {},
      create: {
        title: 'Head Shoulders Knees and Toes',
        thumbnail:
          'https://res.cloudinary.com/dprawkbjt/image/upload/v1772702212/Head_shoulder_db1sdo.jpg',
        duration: 182,
        views: 60,
        video_url:
          'https://www.youtube.com/watch?v=QA48wTGbU7A&list=RDQA48wTGbU7A&start_radio=1',
        category: 'Body Parts',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 58,
            },
            {
              line_order: 2,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
              start_time: 65,
            },
            {
              line_order: 3,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
              start_time: 70,
            },
            {
              line_order: 4,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 76,
            },
            {
              line_order: 5,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 85,
            },
            {
              line_order: 6,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
              start_time: 90,
            },
            {
              line_order: 7,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
              start_time: 8,
            },
            {
              line_order: 9,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 99,
            },
            {
              line_order: 10,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 104,
            },
            {
              line_order: 11,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
              start_time: 108,
            },
            {
              line_order: 12,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
              start_time: 111,
            },
            {
              line_order: 13,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 115,
            },
            {
              line_order: 14,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 120,
            },
            {
              line_order: 15,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
              start_time: 122,
            },
            {
              line_order: 16,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
              start_time: 124,
            },
            {
              line_order: 17,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 127,
            },
            {
              line_order: 18,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 143,
            },
            {
              line_order: 19,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
              start_time: 148,
            },
            {
              line_order: 20,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
              start_time: 153,
            },
            {
              line_order: 21,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
              start_time: 158,
            },
          ],
        },
      },
    }),
    prisma.mini_songs.upsert({
      where: { title: 'Twinkle twinkle little star' },
      update: {},
      create: {
        title: 'Twinkle twinkle little star',
        thumbnail:
          'https://res.cloudinary.com/dprawkbjt/image/upload/v1772702213/Twinkle_twinkle_little_star_jf2ivn.jpg',
        duration: 195,
        views: 34,
        video_url:
          'https://www.youtube.com/watch?v=hqzvHfy-Ij0&list=RDhqzvHfy-Ij0&start_radio=1',
        category: 'Star and Space',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 14,
            },
            {
              line_order: 2,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 20,
            },
            {
              line_order: 3,
              lyric_text: 'Up above the world so high,',
              phonetic: '/ʌp əˈbʌv ðə wɜrld so haɪ/',
              start_time: 27,
            },
            {
              line_order: 4,
              lyric_text: 'Like a diamond in the sky.',
              phonetic: '/laɪk ə ˈdaɪmənd ɪn ðə skaɪ/',
              start_time: 32,
            },
            {
              line_order: 5,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 38,
            },
            {
              line_order: 6,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 44,
            },
            {
              line_order: 7,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 56,
            },
            {
              line_order: 8,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 62,
            },
            {
              line_order: 9,
              lyric_text: 'Up above the world so high,',
              phonetic: '/ʌp əˈbʌv ðə wɜrld so haɪ/',
              start_time: 68,
            },
            {
              line_order: 10,
              lyric_text: 'Like a diamond in the sky.',
              phonetic: '/laɪk ə ˈdaɪmənd ɪn ðə skaɪ/',
              start_time: 74,
            },
            {
              line_order: 11,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 80,
            },
            {
              line_order: 12,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 86,
            },
            {
              line_order: 13,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 99,
            },
            {
              line_order: 14,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 104,
            },
            {
              line_order: 15,
              lyric_text: 'Up above the world so high,',
              phonetic: '/ʌp əˈbʌv ðə wɜrld so haɪ/',
              start_time: 110,
            },
            {
              line_order: 16,
              lyric_text: 'Like a diamond in the sky.',
              phonetic: '/laɪk ə ˈdaɪmənd ɪn ðə skaɪ/',
              start_time: 116,
            },
            {
              line_order: 17,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 121,
            },
            {
              line_order: 18,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 129,
            },
            {
              line_order: 19,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 140,
            },
            {
              line_order: 20,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 146,
            },
            {
              line_order: 21,
              lyric_text: 'Up above the world so high,',
              phonetic: '/ʌp əˈbʌv ðə wɜrld so haɪ/',
              start_time: 153,
            },
            {
              line_order: 22,
              lyric_text: 'Like a diamond in the sky.',
              phonetic: '/laɪk ə ˈdaɪmənd ɪn ðə skaɪ/',
              start_time: 158,
            },
            {
              line_order: 23,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
              start_time: 164,
            },
            {
              line_order: 24,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
              start_time: 170,
            },
          ],
        },
      },
    }),
    prisma.mini_songs.upsert({
      where: { title: 'You are my sunshine' },
      update: {},
      create: {
        title: 'You are my sunshine',
        thumbnail:
          'https://res.cloudinary.com/dprawkbjt/image/upload/v1772702214/You_are_my_sunshine_n2hjc3.jpg',
        duration: 153,
        views: 6,
        video_url:
          'https://www.youtube.com/watch?v=tptPct-lBl4&list=RDtptPct-lBl4&start_radio=1',
        category: 'Feelings',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'You are my sunshine, my only sunshine',
              phonetic: '/juː ɑːr maɪ ˈsʌnʃaɪn maɪ ˈoʊnli ˈsʌnʃaɪn/',
              start_time: 23,
            },
            {
              line_order: 2,
              lyric_text: 'You make me happy when skies are gray',
              phonetic: '/juː meɪk mi ˈhæpi wɛn skaɪz ɑːr ɡreɪ/',
              start_time: 30,
            },
            {
              line_order: 3,
              lyric_text: "You'll never know, dear, how much I love you",
              phonetic: '/juːl ˈnɛvər noʊ dɪr haʊ mʌtʃ aɪ lʌv juː/',
              start_time: 37,
            },
            {
              line_order: 4,
              lyric_text: "Please don't take my sunshine away",
              phonetic: '/pliːz doʊnt teɪk maɪ ˈsʌnʃaɪn əˈweɪ/',
              start_time: 43,
            },
            {
              line_order: 5,
              lyric_text: 'You are my sunshine, my only sunshine',
              phonetic: '/juː ɑːr maɪ ˈsʌnʃaɪn maɪ ˈoʊnli ˈsʌnʃaɪn/',
              start_time: 50,
            },
            {
              line_order: 6,
              lyric_text: 'You make me happy when skies are gray',
              phonetic: '/juː meɪk mi ˈhæpi wɛn skaɪz ɑːr ɡreɪ/',
              start_time: 56,
            },
            {
              line_order: 7,
              lyric_text: "You'll never know, dear, how much I love you",
              phonetic: '/juːl ˈnɛvər noʊ dɪr haʊ mʌtʃ aɪ lʌv juː/',
              start_time: 62,
            },
            {
              line_order: 8,
              lyric_text: "Please don't take my sunshine away",
              phonetic: '/pliːz doʊnt teɪk maɪ ˈsʌnʃaɪn əˈweɪ/',
              start_time: 69,
            },
            {
              line_order: 9,
              lyric_text: 'You are my sunshine, my only sunshine',
              phonetic: '/juː ɑːr maɪ ˈsʌnʃaɪn maɪ ˈoʊnli ˈsʌnʃaɪn/',
              start_time: 113,
            },
            {
              line_order: 10,
              lyric_text: 'You make me happy when skies are gray',
              phonetic: '/juː meɪk mi ˈhæpi wɛn skaɪz ɑːr ɡreɪ/',
              start_time: 120,
            },
            {
              line_order: 11,
              lyric_text: "You'll never know, dear, how much I love you",
              phonetic: '/juːl ˈnɛvər noʊ dɪr haʊ mʌtʃ aɪ lʌv juː/',
              start_time: 125,
            },
            {
              line_order: 12,
              lyric_text: "Please don't take my sunshine away",
              phonetic: '/pliːz doʊnt teɪk maɪ ˈsʌnʃaɪn əˈweɪ/',
              start_time: 131,
            },
          ],
        },
      },
    }),

    prisma.mini_songs.upsert({
      where: { title: 'Old MacDonald had a farm' },
      update: {},
      create: {
        title: 'Old MacDonald had a farm',
        thumbnail:
          'https://res.cloudinary.com/dprawkbjt/image/upload/v1772702213/Old_MacDonald_had_a_farm_lmw0em.jpg',
        duration: 169,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=Wm4R8d0d8kU&list=RDWm4R8d0d8kU&start_radio=1',
        category: 'Funny',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 17,
            },
            {
              line_order: 2,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 20,
            },
            {
              line_order: 3,
              lyric_text: 'And on this farm he had a pig',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə pɪɡ/',
              start_time: 22,
            },
            {
              line_order: 4,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 25,
            },
            {
              line_order: 5,
              lyric_text: 'With an oink oink here',
              phonetic: '/wɪð ən ɔɪŋk ɔɪŋk hɪr/',
              start_time: 27,
            },
            {
              line_order: 6,
              lyric_text: 'And an oink oink there',
              phonetic: '/ænd ən ɔɪŋk ɔɪŋk ðer/',
              start_time: 28,
            },
            {
              line_order: 7,
              lyric_text: 'Here an oink, there an oink,',
              phonetic: '/hɪr ən ɔɪŋk ðer ən ɔɪŋk/',
              start_time: 30,
            },
            {
              line_order: 8,
              lyric_text: 'Everywhere an oink oink!',
              phonetic: '/ˈevriwer ən ɔɪŋk ɔɪŋk/',
              start_time: 31,
            },
            {
              line_order: 9,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 32,
            },
            {
              line_order: 10,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 35,
            },

            {
              line_order: 11,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 39,
            },
            {
              line_order: 12,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 42,
            },
            {
              line_order: 13,
              lyric_text: 'And on this farm he had a sheep',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə ʃiːp/',
              start_time: 44,
            },
            {
              line_order: 14,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 46,
            },
            {
              line_order: 15,
              lyric_text: 'With a baa baa here',
              phonetic: '/wɪð ə bɑː bɑː hɪr/',
              start_time: 49,
            },
            {
              line_order: 16,
              lyric_text: 'And a baa baa there',
              phonetic: '/ænd ə bɑː bɑː ðer/',
              start_time: 50,
            },
            {
              line_order: 17,
              lyric_text: 'Here a baa, there a baa,',
              phonetic: '/hɪr ə bɑː ðer ə bɑː/',
              start_time: 51,
            },
            {
              line_order: 18,
              lyric_text: 'Everywhere a baa baa!',
              phonetic: '/ˈevriwer ə bɑː bɑː/',
              start_time: 52,
            },
            {
              line_order: 19,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 54,
            },
            {
              line_order: 20,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 56,
            },

            {
              line_order: 21,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 61,
            },
            {
              line_order: 22,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 63,
            },
            {
              line_order: 23,
              lyric_text: 'And on this farm he had a cow',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə kaʊ/',
              start_time: 65,
            },
            {
              line_order: 24,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 68,
            },
            {
              line_order: 25,
              lyric_text: 'With a moo moo here',
              phonetic: '/wɪð ə muː muː hɪr/',
              start_time: 71,
            },
            {
              line_order: 26,
              lyric_text: 'And a moo moo there',
              phonetic: '/ænd ə muː muː ðer/',
              start_time: 72,
            },
            {
              line_order: 27,
              lyric_text: 'Here a moo, there a moo,',
              phonetic: '/hɪr ə muː ðer ə muː/',
              start_time: 73,
            },
            {
              line_order: 28,
              lyric_text: 'Everywhere a moo moo!',
              phonetic: '/ˈevriwer ə muː muː/',
              start_time: 74,
            },
            {
              line_order: 29,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 76,
            },
            {
              line_order: 30,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 78,
            },

            {
              line_order: 31,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 82,
            },
            {
              line_order: 32,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 85,
            },
            {
              line_order: 33,
              lyric_text: 'And on this farm he had a horse',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə hɔːrs/',
              start_time: 87,
            },
            {
              line_order: 34,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 89,
            },
            {
              line_order: 35,
              lyric_text: 'With a neigh neigh here',
              phonetic: '/wɪð ə neɪ neɪ hɪr/',
              start_time: 92,
            },
            {
              line_order: 36,
              lyric_text: 'And a neigh neigh there',
              phonetic: '/ænd ə neɪ neɪ ðer/',
              start_time: 93,
            },
            {
              line_order: 37,
              lyric_text: 'Here a neigh, there a neigh,',
              phonetic: '/hɪr ə neɪ ðer ə neɪ/',
              start_time: 94,
            },
            {
              line_order: 38,
              lyric_text: 'Everywhere a neigh neigh!',
              phonetic: '/ˈevriwer ə neɪ neɪ/',
              start_time: 95,
            },
            {
              line_order: 39,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 97,
            },
            {
              line_order: 40,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 99,
            },

            {
              line_order: 41,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 105,
            },
            {
              line_order: 42,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 107,
            },
            {
              line_order: 43,
              lyric_text: 'And on this farm he had a duck',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə dʌk/',
              start_time: 109,
            },
            {
              line_order: 44,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 111,
            },
            {
              line_order: 45,
              lyric_text: 'With a quack quack here',
              phonetic: '/wɪð ə kwæk kwæk hɪr/',
              start_time: 113,
            },
            {
              line_order: 46,
              lyric_text: 'And a quack quack there',
              phonetic: '/ænd ə kwæk kwæk ðer/',
              start_time: 114,
            },
            {
              line_order: 47,
              lyric_text: 'Here a quack, there a quack,',
              phonetic: '/hɪr ə kwæk ðer ə kwæk/',
              start_time: 116,
            },
            {
              line_order: 48,
              lyric_text: 'Everywhere a quack quack!',
              phonetic: '/ˈevriwer ə kwæk kwæk/',
              start_time: 118,
            },
            {
              line_order: 49,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 119,
            },
            {
              line_order: 50,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 121,
            },

            {
              line_order: 51,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 125,
            },
            {
              line_order: 52,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 128,
            },
            {
              line_order: 53,
              lyric_text: 'And on this farm he had a chicken',
              phonetic: '/ænd ɒn ðɪs fɑːrm hiː hæd ə ˈtʃɪkɪn/',
              start_time: 130,
            },
            {
              line_order: 54,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 133,
            },
            {
              line_order: 55,
              lyric_text: 'With a cluck cluck here',
              phonetic: '/wɪð ə klʌk klʌk hɪr/',
              start_time: 135,
            },
            {
              line_order: 56,
              lyric_text: 'And a cluck cluck there',
              phonetic: '/ænd ə klʌk klʌk ðer/',
              start_time: 137,
            },
            {
              line_order: 57,
              lyric_text: 'Here a cluck, there a cluck,',
              phonetic: '/hɪr ə klʌk ðer ə klʌk/',
              start_time: 138,
            },
            {
              line_order: 58,
              lyric_text: 'Everywhere a cluck cluck!',
              phonetic: '/ˈevriwer ə klʌk klʌk/',
              start_time: 139,
            },
            {
              line_order: 59,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɒnəld hæd ə fɑːrm/',
              start_time: 141,
            },
            {
              line_order: 60,
              lyric_text: 'E-I-E-I-O!',
              phonetic: '/iː aɪ iː aɪ oʊ/',
              start_time: 143,
            },
          ],
        },
      },
    }),
    prisma.mini_songs.upsert({
      where: { title: 'If You’re Happy And You Know It' },
      update: {},
      create: {
        title: 'If You’re Happy And You Know It',
        thumbnail:
          'https://res.cloudinary.com/dprawkbjt/image/upload/v1772702212/If_You_re_Happy_And_You_Know_It_xniblc.jpg',
        duration: 179,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=9hfsBgavsmc&list=RD9hfsBgavsmc&start_radio=1',
        category: 'Feelings',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: "If you're happy and you know it, clap your hands.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
              start_time: 11,
            },
            {
              line_order: 2,
              lyric_text: "If you're happy and you know it, clap your hands.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
              start_time: 16,
            },
            {
              line_order: 3,
              lyric_text: "If you're happy and you know it,",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
              start_time: 20,
            },
            {
              line_order: 4,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 22,
            },
            {
              line_order: 5,
              lyric_text: "If you're happy and you know it, clap your hands.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
              start_time: 24,
            },

            {
              line_order: 6,
              lyric_text: "If you're hungry and you know it, pat your belly.",
              phonetic: '/ɪf jʊr ˈhʌŋɡri ænd ju noʊ ɪt pæt jʊr ˈbɛli/',
              start_time: 30,
            },
            {
              line_order: 7,
              lyric_text: "If you're hungry and you know it, pat your belly.",
              phonetic: '/ɪf jʊr ˈhʌŋɡri ænd ju noʊ ɪt pæt jʊr ˈbɛli/',
              start_time: 35,
            },
            {
              line_order: 8,
              lyric_text: "If you're hungry and you know it,",
              phonetic: '/ɪf jʊr ˈhʌŋɡri ænd ju noʊ ɪt/',
              start_time: 39,
            },
            {
              line_order: 9,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 41,
            },
            {
              line_order: 10,
              lyric_text: "If you're hungry and you know it, pat your belly.",
              phonetic: '/ɪf jʊr ˈhʌŋɡri ænd ju noʊ ɪt pæt jʊr ˈbɛli/',
              start_time: 43,
            },

            {
              line_order: 11,
              lyric_text: "If you're tired and you know it, stretch and yawn.",
              phonetic: '/ɪf jʊr ˈtaɪərd ænd ju noʊ ɪt strɛtʃ ænd jɔn/',
              start_time: 50,
            },
            {
              line_order: 12,
              lyric_text: "If you're tired and you know it, stretch and yawn.",
              phonetic: '/ɪf jʊr ˈtaɪərd ænd ju noʊ ɪt strɛtʃ ænd jɔn/',
              start_time: 53,
            },
            {
              line_order: 13,
              lyric_text: "If you're tired and you know it,",
              phonetic: '/ɪf jʊr ˈtaɪərd ænd ju noʊ ɪt/',
              start_time: 57,
            },
            {
              line_order: 14,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 60,
            },
            {
              line_order: 15,
              lyric_text: "If you're tired and you know it, stretch and yawn.",
              phonetic: '/ɪf jʊr ˈtaɪərd ænd ju noʊ ɪt strɛtʃ ænd jɔn/',
              start_time: 62,
            },

            {
              line_order: 16,
              lyric_text: "If you're angry and you know it, take a breath.",
              phonetic: '/ɪf jʊr ˈæŋɡri ænd ju noʊ ɪt teɪk ə brɛθ/',
              start_time: 68,
            },
            {
              line_order: 17,
              lyric_text: "If you're angry and you know it, take a breath.",
              phonetic: '/ɪf jʊr ˈæŋɡri ænd ju noʊ ɪt teɪk ə brɛθ/',
              start_time: 73,
            },
            {
              line_order: 18,
              lyric_text: "If you're angry and you know it,",
              phonetic: '/ɪf jʊr ˈæŋɡri ænd ju noʊ ɪt/',
              start_time: 76,
            },
            {
              line_order: 19,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 80,
            },
            {
              line_order: 20,
              lyric_text: "If you're angry and you know it, take a breath.",
              phonetic: '/ɪf jʊr ˈæŋɡri ænd ju noʊ ɪt teɪk ə brɛθ/',
              start_time: 82,
            },

            {
              line_order: 21,
              lyric_text: "If you're surprised and you know it, jump right up.",
              phonetic: '/ɪf jʊr sərˈpraɪzd ænd ju noʊ ɪt dʒʌmp raɪt ʌp/',
              start_time: 87,
            },
            {
              line_order: 22,
              lyric_text: "If you're surprised and you know it, jump right up.",
              phonetic: '/ɪf jʊr sərˈpraɪzd ænd ju noʊ ɪt dʒʌmp raɪt ʌp/',
              start_time: 92,
            },
            {
              line_order: 23,
              lyric_text: "If you're surprised and you know it,",
              phonetic: '/ɪf jʊr sərˈpraɪzd ænd ju noʊ ɪt/',
              start_time: 96,
            },
            {
              line_order: 24,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 98,
            },
            {
              line_order: 25,
              lyric_text: "If you're surprised and you know it, jump right up.",
              phonetic: '/ɪf jʊr sərˈpraɪzd ænd ju noʊ ɪt dʒʌmp raɪt ʌp/',
              start_time: 101,
            },

            {
              line_order: 26,
              lyric_text: "If you're sad and you know it, rub your eyes.",
              phonetic: '/ɪf jʊr sæd ænd ju noʊ ɪt rʌb jʊr aɪz/',
              start_time: 108,
            },
            {
              line_order: 27,
              lyric_text: "If you're sad and you know it, rub your eyes.",
              phonetic: '/ɪf jʊr sæd ænd ju noʊ ɪt rʌb jʊr aɪz/',
              start_time: 112,
            },
            {
              line_order: 28,
              lyric_text: "If you're sad and you know it,",
              phonetic: '/ɪf jʊr sæd ænd ju noʊ ɪt/',
              start_time: 116,
            },
            {
              line_order: 29,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 118,
            },
            {
              line_order: 30,
              lyric_text: "If you're sad and you know it, rub your eyes.",
              phonetic: '/ɪf jʊr sæd ænd ju noʊ ɪt rʌb jʊr aɪz/',
              start_time: 120,
            },

            {
              line_order: 31,
              lyric_text: "If you're silly and you know it, show it off!",
              phonetic: '/ɪf jʊr ˈsɪli ænd ju noʊ ɪt ʃoʊ ɪt ɔf/',
              start_time: 128,
            },
            {
              line_order: 32,
              lyric_text: "If you're silly and you know it, show it off.",
              phonetic: '/ɪf jʊr ˈsɪli ænd ju noʊ ɪt ʃoʊ ɪt ɔf/',
              start_time: 132,
            },
            {
              line_order: 33,
              lyric_text: "If you're silly and you know it,",
              phonetic: '/ɪf jʊr ˈsɪli ænd ju noʊ ɪt/',
              start_time: 136,
            },
            {
              line_order: 34,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 138,
            },
            {
              line_order: 35,
              lyric_text: "If you're silly and you know it, show it off.",
              phonetic: '/ɪf jʊr ˈsɪli ænd ju noʊ ɪt ʃoʊ ɪt ɔf/',
              start_time: 141,
            },

            {
              line_order: 36,
              lyric_text: "If you're happy and you know it, shout hooray.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
              start_time: 147,
            },
            {
              line_order: 37,
              lyric_text: 'Hooray!',
              phonetic: '/hʊˈreɪ/',
              start_time: 150,
            },
            {
              line_order: 38,
              lyric_text: "If you're happy and you know it, shout hooray.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
              start_time: 151,
            },
            {
              line_order: 39,
              lyric_text: 'Hooray!',
              phonetic: '/hʊˈreɪ/',
              start_time: 155,
            },
            {
              line_order: 40,
              lyric_text: "If you're happy and you know it,",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
              start_time: 156,
            },
            {
              line_order: 41,
              lyric_text: 'and you really want to show it.',
              phonetic: '/ænd ju ˈrɪəli wɑnt tu ʃoʊ ɪt/',
              start_time: 158,
            },
            {
              line_order: 42,
              lyric_text: "If you're happy and you know it, shout hooray.",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
              start_time: 160,
            },
            {
              line_order: 43,
              lyric_text: 'Hooray!',
              phonetic: '/hʊˈreɪ/',
              start_time: 163,
            },
          ],
        },
      },
    }),
  ]);

  const topics = await Promise.all([
    prisma.topics.upsert({
      where: { topic_id: '1' },
      update: {},
      create: {
        topic_name: 'Animals',
        icon: '🐾',
      },
    }),
    prisma.topics.upsert({
      where: { topic_id: '2' },
      update: {},
      create: {
        topic_name: 'Colors',
        icon: '🎨',
      },
    }),
    prisma.topics.upsert({
      where: { topic_id: '3' },
      update: {},
      create: {
        topic_name: 'Family',
        icon: '👨👩👧👦',
      },
    }),
  ]);

  const levels = await Promise.all([
    prisma.levels.upsert({
      where: { level_id: '1' },
      update: {},
      create: {
        level_name: 'Easy',
      },
    }),
    prisma.levels.upsert({
      where: { level_id: '2' },
      update: {},
      create: {
        level_name: 'Medium',
      },
    }),
    prisma.levels.upsert({
      where: { level_id: '3' },
      update: {},
      create: {
        level_name: 'Advanced',
      },
    }),
  ]);

  // Seed sentences
  const sentences = await Promise.all([
    prisma.sentences.create({
      data: {
        topic_id: topics[0].topic_id,
        level_id: levels[0].level_id,
        sentence_text: 'The cat is sleeping.',
        meaning: 'Con mèo đang ngủ.',
        phonetic: '/ðə kæt ɪz ˈsliːpɪŋ/',
        audio_url: 'https://example.com/audio1.mp3',
      },
    }),
    prisma.sentences.create({
      data: {
        topic_id: topics[1].topic_id,
        level_id: levels[0].level_id,
        sentence_text: 'The apple is red.',
        meaning: 'Quả táo màu đỏ.',
        phonetic: '/ðə ˈæpəl ɪz rɛd/',
        audio_url: 'https://example.com/audio2.mp3',
      },
    }),
    prisma.sentences.create({
      data: {
        topic_id: topics[2].topic_id,
        level_id: levels[1].level_id,
        sentence_text: 'My mother loves me.',
        meaning: 'Mẹ tôi yêu tôi.',
        phonetic: '/maɪ ˈmʌðər lʌvz mi/',
        audio_url: 'https://example.com/audio3.mp3',
      },
    }),
  ]);

  console.log('Seed completed!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${miniSongs.length} mini songs`);
  console.log(`Created ${topics.length} topics`);
  console.log(`Created ${levels.length} levels`);
  console.log(`Created ${sentences.length} sentences`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
