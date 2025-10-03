import React from 'react';
import { StudyAids } from '../types';
import { FlashcardViewer } from './Flashcard';
import { QuizView } from './Quiz';

interface ResultsDisplayProps {
  results: StudyAids;
  onRegenerateQuiz: () => Promise<void>;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onRegenerateQuiz }) => {
  return (
    <div className="mt-12 space-y-12">
      {results.flashcards && results.flashcards.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">Flashcards</h2>
          <FlashcardViewer flashcards={results.flashcards} />
        </section>
      )}
      {results.quiz && results.quiz.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">Quiz</h2>
          <QuizView questions={results.quiz} onRegenerate={onRegenerateQuiz} />
        </section>
      )}
    </div>
  );
};
