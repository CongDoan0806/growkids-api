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
        duration: 4,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=QA48wTGbU7A&list=RDQA48wTGbU7A&start_radio=1',
        category: 'Body Parts',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
            },
            {
              line_order: 2,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
            },
            {
              line_order: 3,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
            },
            {
              line_order: 4,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
            },
            {
              line_order: 5,
              lyric_text:
                'Head, shoulders, knees and toes (Knees and toes, and)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz ænd)/',
            },
            {
              line_order: 6,
              lyric_text: 'Eyes and ears and mouth and nose',
              phonetic: '/aɪz ænd ɪrz ænd maʊθ ænd noʊz/',
            },
            {
              line_order: 7,
              lyric_text: 'Head, shoulders, knees and toes (Knees and toes)',
              phonetic: '/hɛd ˈʃoʊldərz niːz ænd toʊz (niːz ænd toʊz)/',
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
        duration: 3.4,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=hqzvHfy-Ij0&list=RDhqzvHfy-Ij0&start_radio=1',
        category: 'Star and Space',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Twinkle, twinkle, little star,',
              phonetic: '/ˈtwɪŋkəl ˈtwɪŋkəl ˈlɪtl stɑr/',
            },
            {
              line_order: 2,
              lyric_text: 'How I wonder what you are!',
              phonetic: '/haʊ aɪ ˈwʌndər wʌt ju ɑr/',
            },
            {
              line_order: 3,
              lyric_text: 'Up above the world so high,',
              phonetic: '/ʌp əˈbʌv ðə wɜrld so haɪ/',
            },
            {
              line_order: 4,
              lyric_text: 'Like a diamond in the sky.',
              phonetic: '/laɪk ə ˈdaɪmənd ɪn ðə skaɪ/',
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
        duration: 2,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=tptPct-lBl4&list=RDtptPct-lBl4&start_radio=1',
        category: 'Feelings',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'You are my sunshine, my only sunshine',
              phonetic: '/juː ɑːr maɪ ˈsʌnʃaɪn maɪ ˈoʊnli ˈsʌnʃaɪn/',
            },
            {
              line_order: 2,
              lyric_text: 'You make me happy when skies are gray',
              phonetic: '/juː meɪk mi ˈhæpi wɛn skaɪz ɑːr ɡreɪ/',
            },
            {
              line_order: 3,
              lyric_text: "You'll never know, dear, how much I love you",
              phonetic: '/juːl ˈnɛvər noʊ dɪr haʊ mʌtʃ aɪ lʌv juː/',
            },
            {
              line_order: 4,
              lyric_text: "Please don't take my sunshine away",
              phonetic: '/pliːz doʊnt teɪk maɪ ˈsʌnʃaɪn əˈweɪ/',
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
        duration: 3,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=Wm4R8d0d8kU&list=RDWm4R8d0d8kU&start_radio=1',
        category: 'Funny',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɑːnəld hæd ə fɑːrm/',
            },
            {
              line_order: 2,
              lyric_text: 'E-I-E-I-O',
              phonetic: '/iː aɪ iː aɪ oʊ/',
            },
            {
              line_order: 3,
              lyric_text: 'And on his farm he had a cow',
              phonetic: '/ænd ɑːn hɪz fɑːrm hi hæd ə kaʊ/',
            },
            {
              line_order: 4,
              lyric_text: 'E-I-E-I-O',
              phonetic: '/iː aɪ iː aɪ oʊ/',
            },
            {
              line_order: 5,
              lyric_text: 'With a moo moo here and a moo moo there',
              phonetic: '/wɪð ə muː muː hɪr ænd ə muː muː ðer/',
            },
            {
              line_order: 6,
              lyric_text: 'Here a moo, there a moo, everywhere a moo moo',
              phonetic: '/hɪr ə muː ðer ə muː ˈɛvrɪwer ə muː muː/',
            },
            {
              line_order: 7,
              lyric_text: 'Old MacDonald had a farm',
              phonetic: '/oʊld mækˈdɑːnəld hæd ə fɑːrm/',
            },
            {
              line_order: 8,
              lyric_text: 'E-I-E-I-O',
              phonetic: '/iː aɪ iː aɪ oʊ/',
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
        duration: 3,
        views: 0,
        video_url:
          'https://www.youtube.com/watch?v=9hfsBgavsmc&list=RD9hfsBgavsmc&start_radio=1',
        category: 'Feelings',
        song_lyrics: {
          create: [
            {
              line_order: 1,
              lyric_text: "If you're happy and you know it, clap your hands",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
            },
            {
              line_order: 2,
              lyric_text: "If you're happy and you know it, clap your hands",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
            },
            {
              line_order: 3,
              lyric_text: "If you're happy and you know it",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
            },
            {
              line_order: 4,
              lyric_text: 'Then your face will surely show it',
              phonetic: '/ðen jʊr feɪs wɪl ˈʃʊrli ʃoʊ ɪt/',
            },
            {
              line_order: 5,
              lyric_text: "If you're happy and you know it, clap your hands",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt klæp jʊr hændz/',
            },

            {
              line_order: 6,
              lyric_text: "If you're happy and you know it, stomp your feet",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt stɑmp jʊr fit/',
            },
            {
              line_order: 7,
              lyric_text: "If you're happy and you know it, stomp your feet",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt stɑmp jʊr fit/',
            },
            {
              line_order: 8,
              lyric_text: "If you're happy and you know it",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
            },
            {
              line_order: 9,
              lyric_text: 'Then your face will surely show it',
              phonetic: '/ðen jʊr feɪs wɪl ˈʃʊrli ʃoʊ ɪt/',
            },
            {
              line_order: 10,
              lyric_text: "If you're happy and you know it, stomp your feet",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt stɑmp jʊr fit/',
            },

            {
              line_order: 11,
              lyric_text:
                "If you're happy and you know it, shout hurray (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
            },
            {
              line_order: 12,
              lyric_text:
                "If you're happy and you know it, shout hurray (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
            },
            {
              line_order: 13,
              lyric_text: "If you're happy and you know it",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
            },
            {
              line_order: 14,
              lyric_text: 'Then your face will surely show it',
              phonetic: '/ðen jʊr feɪs wɪl ˈʃʊrli ʃoʊ ɪt/',
            },
            {
              line_order: 15,
              lyric_text:
                "If you're happy and you know it, shout hurray (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt ʃaʊt hʊˈreɪ/',
            },

            {
              line_order: 16,
              lyric_text:
                "If you're happy and you know it, do all three (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt du ɔl θri/',
            },
            {
              line_order: 17,
              lyric_text:
                "If you're happy and you know it, do all three (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt du ɔl θri/',
            },
            {
              line_order: 18,
              lyric_text: "If you're happy and you know it",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt/',
            },
            {
              line_order: 19,
              lyric_text: 'Then your face will surely show it',
              phonetic: '/ðen jʊr feɪs wɪl ˈʃʊrli ʃoʊ ɪt/',
            },
            {
              line_order: 20,
              lyric_text:
                "If you're happy and you know it, do all three (hurray)",
              phonetic: '/ɪf jʊr ˈhæpi ænd ju noʊ ɪt du ɔl θri/',
            },
          ],
        },
      },
    }),
  ]);

  console.log('Seed completed!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${miniSongs.length} mini songs`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
