export enum OutputType {
  FLASHCARDS = 'Flashcards',
  QUIZ = 'Quiz',
}

export interface Flashcard {
  question: string;
  answer: string;
}

export enum QuizQuestionType {
  MCQ = 'MCQ',
}

export interface QuizQuestion {
  question: string;
  type: QuizQuestionType;
  options: string[];
  answer: string;
}

export interface StudyAids {
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
}

// Fix: Add missing MindMapNode interface.
export interface MindMapNode {
  topic: string;
  children?: MindMapNode[];
}
