import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { PreviousIcon, NextIcon, ShuffleIcon } from './icons';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  animationClass: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, isFlipped, onFlip, animationClass }) => {
  return (
    <div className={`w-full h-64 md:h-80 perspective-1000 ${animationClass}`} onClick={onFlip}>
      <div
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 rounded-lg bg-white dark:bg-slate-700 shadow-xl border border-slate-200 dark:border-slate-600 cursor-pointer">
          <p className="text-xl text-center font-semibold text-slate-800 dark:text-slate-100">{card.question}</p>
        </div>
        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 rounded-lg bg-sky-100 dark:bg-sky-900/50 shadow-xl border border-sky-200 dark:border-sky-700 cursor-pointer">
          <p className="text-lg text-center text-slate-700 dark:text-slate-200">{card.answer}</p>
        </div>
      </div>
    </div>
  );
};

interface FlashcardViewerProps {
    flashcards: FlashcardType[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardDeck, setCardDeck] = useState([...flashcards]);
    const [animationClass, setAnimationClass] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setCardDeck([...flashcards]);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [flashcards]);

    const handleFlip = () => {
        if (isAnimating) return;
        setIsFlipped(prev => !prev);
    };

    const goToNext = useCallback(() => {
        if (currentIndex < cardDeck.length - 1 && !isAnimating) {
            setIsAnimating(true);
            setIsFlipped(false);
            setAnimationClass('animate-slide-out-left');
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setAnimationClass('animate-slide-in-right');
                setTimeout(() => {
                    setIsAnimating(false);
                }, 300);
            }, 300);
        }
    }, [currentIndex, cardDeck.length, isAnimating]);

    const goToPrev = useCallback(() => {
        if (currentIndex > 0 && !isAnimating) {
            setIsAnimating(true);
            setIsFlipped(false);
            setAnimationClass('animate-slide-out-right');
            setTimeout(() => {
                setCurrentIndex(prev => prev - 1);
                setAnimationClass('animate-slide-in-left');
                 setTimeout(() => {
                    setIsAnimating(false);
                }, 300);
            }, 300);
        }
    }, [currentIndex, isAnimating]);
    
    const shuffleDeck = useCallback(() => {
        if (isAnimating) return;
        const shuffled = [...cardDeck].sort(() => Math.random() - 0.5);
        setCardDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [cardDeck, isAnimating]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'ArrowRight') {
                goToNext();
            } else if (event.code === 'ArrowLeft') {
                goToPrev();
            } else if (event.code === 'Space') {
                event.preventDefault(); // Prevent page scroll
                handleFlip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToNext, goToPrev]);

    if (!cardDeck || cardDeck.length === 0) {
        return <p>No flashcards available.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <Flashcard card={cardDeck[currentIndex]} isFlipped={isFlipped} onFlip={handleFlip} animationClass={animationClass} />
            <div className="text-center font-semibold text-slate-600 dark:text-slate-400">
                Card {currentIndex + 1} of {cardDeck.length}
            </div>
            <div className="flex items-center justify-between w-full">
                 <button 
                    onClick={shuffleDeck}
                    disabled={isAnimating}
                    className="flex items-center gap-2 p-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    aria-label="Shuffle deck"
                >
                    <ShuffleIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={goToPrev} 
                        disabled={currentIndex === 0 || isAnimating}
                        className="p-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Previous card"
                    >
                        <PreviousIcon />
                    </button>
                    <button 
                        onClick={goToNext} 
                        disabled={currentIndex === cardDeck.length - 1 || isAnimating}
                        className="p-4 rounded-full bg-sky-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors"
                        aria-label="Next card"
                    >
                        <NextIcon />
                    </button>
                </div>
            </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Tip: Use <kbd className="font-sans border rounded px-1.5 py-0.5 border-slate-300 dark:border-slate-600">Space</kbd> to flip, and <kbd className="font-sans border rounded px-1.5 py-0.5 border-slate-300 dark:border-slate-600">←</kbd> <kbd className="font-sans border rounded px-1.5 py-0.5 border-slate-300 dark:border-slate-600">→</kbd> to navigate.
            </p>
        </div>
    );
}