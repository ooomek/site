import type { ChapterData } from '../components/EBookReader/types';

export const chapter1Data: ChapterData = {
  id: 'chapter-1',
  title: 'Из чего сделан весь мир?',
  subtitle: 'Маленькое путешествие в большой мир',
  pageWidth: 2052,
  pageHeight: 3072,
  pages: Array.from({ length: 8 }, (_, index) => ({
    id: `page-${index + 1}`,
    image: `/chapter-1/images/MEK_chapter_1_image_${String(index + 1).padStart(2, '0')}.png`,
    alt: `Глава 1. Страница ${index + 1} из 8`,
  })),
  audioSequence: [
    { id: 'st-1', src: '/chapter-1/audio/story-tell/st-1.mp3', speaker: 'Рассказчик' },
    { id: 'niki-1', src: '/chapter-1/audio/niki/niki-1.mp3', speaker: 'Ники' },
    { id: 'pasha-1', src: '/chapter-1/audio/pasha/pasha-1.mp3', speaker: 'Паша' },
    { id: 'niki-3', src: '/chapter-1/audio/niki/niki-3.mp3', speaker: 'Ники' },
    { id: 'st-2', src: '/chapter-1/audio/story-tell/st-2.mp3', speaker: 'Рассказчик' },
    { id: 'pasha-2', src: '/chapter-1/audio/pasha/pasha-2.mp3', speaker: 'Паша' },
    { id: 'niki-4', src: '/chapter-1/audio/niki/niki-4.mp3', speaker: 'Ники' },
    { id: 'st-3', src: '/chapter-1/audio/story-tell/st-3.mp3', speaker: 'Рассказчик' },
    // The supplied pasha-3 recording is used for step pasha-4, as confirmed by the user.
    { id: 'pasha-4', src: '/chapter-1/audio/pasha/pasha-3.mp3', speaker: 'Паша' },
    { id: 'niki-5', src: '/chapter-1/audio/niki/niki-5.mp3', speaker: 'Ники' },
    { id: 'st-4', src: '/chapter-1/audio/story-tell/st-4.mp3', speaker: 'Рассказчик' },
  ],
  quizQuestions: [
    {
      id: 'everything', question: 'Из чего состоит всё вокруг нас?',
      options: [{ id: 'A', text: 'Из молекул' }, { id: 'B', text: 'Из атомов' }, { id: 'C', text: 'Из клеток' }],
      correctAnswer: 'B',
    },
    {
      id: 'center', question: 'Что находится в центре атома?',
      options: [{ id: 'A', text: 'Электроны' }, { id: 'B', text: 'Ядро' }, { id: 'C', text: 'Воздух' }],
      correctAnswer: 'B',
    },
    {
      id: 'charge', question: 'Какие частицы имеют положительный заряд?',
      options: [{ id: 'A', text: 'Электроны' }, { id: 'B', text: 'Нейтроны' }, { id: 'C', text: 'Протоны' }],
      correctAnswer: 'C',
    },
    {
      id: 'states', question: 'В каком состоянии частицы движутся наиболее свободно?',
      options: [{ id: 'A', text: 'В твёрдом' }, { id: 'B', text: 'В жидком' }, { id: 'C', text: 'В газообразном' }],
      correctAnswer: 'C',
    },
    {
      id: 'visibility', question: 'Можно ли увидеть атом невооружённым глазом?',
      options: [{ id: 'A', text: 'Да' }, { id: 'B', text: 'Нет' }, { id: 'C', text: 'Только в телескоп' }],
      correctAnswer: 'B',
    },
  ],
};
