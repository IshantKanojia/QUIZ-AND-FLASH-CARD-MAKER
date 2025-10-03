import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizQuestionProps {
  question: QuizQuestion;
  index: number;
  selectedAnswer?: string;
  isSubmitted: boolean;
  onSelectOption: (questionIndex: number, option: string) => void;
}

const QuizQuestionCard: React.FC<QuizQuestionProps> = ({ question, index, selectedAnswer, isSubmitted, onSelectOption }) => {

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    onSelectOption(index, option);
  };

  const getOptionClasses = (option: string) => {
    if (!isSubmitted) {
      return selectedAnswer === option ? 'bg-sky-200 dark:bg-sky-800 ring-2 ring-sky-500' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600';
    }
    if (option === question.answer) {
      return 'bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200';
    }
    if (option === selectedAnswer && option !== question.answer) {
      return 'bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200';
    }
    return 'bg-slate-100 dark:bg-slate-700';
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      <p className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-100">
        <span className="text-sky-600 dark:text-sky-400 font-bold">{index + 1}.</span> {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionSelect(option)}
            disabled={isSubmitted}
            className={`w-full text-left p-3 rounded-md transition-all ${getOptionClasses(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};


interface QuizViewProps {
    questions: QuizQuestion[];
    onRegenerate: () => Promise<void>;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onRegenerate }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelectOption = (questionIndex: number, option: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setIsSubmitted(true);
    };

    const handleTryNewQuiz = () => {
        onRegenerate();
    };

    const allQuestionsAnswered = Object.keys(answers).length === questions.length;

    return (
        <div className="space-y-6">
            {isSubmitted && (
                 <div className="p-6 bg-sky-100 dark:bg-sky-900/50 rounded-xl border border-sky-200 dark:border-sky-700 shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Results</h3>
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                        You scored <span className="font-bold text-sky-600 dark:text-sky-400">{score}</span> out of <span className="font-bold">{questions.length}</span>!
                    </p>
                </div>
            )}
            {questions.map((q, index) => (
                <QuizQuestionCard 
                    key={index} 
                    question={q} 
                    index={index}
                    selectedAnswer={answers[index]}
                    isSubmitted={isSubmitted}
                    onSelectOption={handleSelectOption}
                 />
            ))}
             <div className="mt-8 text-center">
                {!isSubmitted ? (
                    <button 
                        onClick={handleSubmit} 
                        disabled={!allQuestionsAnswered}
                        className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-sky-700 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button 
                        onClick={handleTryNewQuiz} 
                        className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-700 transition-all"
                    >
                        Generate New Quiz
                    </button>
                )}
            </div>
        </div>
    );
};
