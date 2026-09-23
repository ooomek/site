export type BookPage = { id: string; image: string; alt: string };

export type AudioTrack = { id: string; src: string; speaker: string };

export type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
};

export type ChapterData = {
  id: string;
  title: string;
  subtitle: string;
  pageWidth: number;
  pageHeight: number;
  pages: BookPage[];
  audioSequence: AudioTrack[];
  quizQuestions: QuizQuestion[];
};
