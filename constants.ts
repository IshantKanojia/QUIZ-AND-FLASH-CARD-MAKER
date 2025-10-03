import { OutputType } from './types';
import { CardIcon, QuizIcon } from './components/icons';

export const OUTPUT_TYPES = [
  {
    id: OutputType.FLASHCARDS,
    label: 'Flashcards',
    icon: CardIcon,
    description: "Q&A style cards for active recall.",
  },
  {
    id: OutputType.QUIZ,
    label: 'Quiz',
    icon: QuizIcon,
    description: "Test your knowledge with questions.",
  },
];