'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard } from '@/lib/flashcards/flashcard-types';
import './FlashcardModal.css';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  subdomainTitle: string;
  domainColor: string;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ 
  isOpen, 
  onClose, 
  flashcards,
  subdomainTitle,
  domainColor
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reset state when modal opens with new cards
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setProgress(new Set());
    }
  }, [isOpen, flashcards]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'k':
        case 'K':
          markAsKnown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, isFlipped]);

  if (!isOpen || flashcards.length === 0) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const markAsKnown = () => {
    const newProgress = new Set(progress);
    newProgress.add(flashcards[currentIndex].id);
    setProgress(newProgress);
    if (currentIndex < flashcards.length - 1) {
      handleNext();
    }
  };

  const handleComplete = () => {
    onClose();
  };

  const currentCard = flashcards[currentIndex];
  const progressPercentage = (progress.size / flashcards.length) * 100;
  const isLastCard = currentIndex === flashcards.length - 1;
  const allCardsKnown = progress.size === flashcards.length;

  return (
    <div className="flashcard-modal-overlay" onClick={onClose}>
      <div className="flashcard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ '--domain-color': domainColor } as React.CSSProperties}>
          <div className="modal-title">
            <h2>{subdomainTitle}</h2>
            <span className="card-counter">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${progressPercentage}%`,
                backgroundColor: domainColor 
              }}
            />
          </div>
          <div className="progress-text">
            {progress.size} / {flashcards.length} mastered
          </div>
        </div>

        {/* Flashcard */}
        <div className="flashcard-container">
          <div className="flashcard-wrapper">
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
              style={{ '--domain-color': domainColor } as React.CSSProperties}
            >
              <div className="flashcard-front">
                <div className="card-label">Question</div>
                <div className="card-content">
                  <p>{currentCard.front}</p>
                </div>
                <div className="flip-hint">Click to reveal answer</div>
              </div>
              
              <div className="flashcard-back">
                <div className="card-label">Answer</div>
                <div className="card-content">
                  <div className="answer-text">
                    {currentCard.back.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="flip-hint">Click to see question</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="controls">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Previous
          </button>
          
          <button 
            className={`btn ${progress.has(currentCard.id) ? 'btn-success-outline' : 'btn-success'}`}
            onClick={markAsKnown}
            disabled={progress.has(currentCard.id)}
          >
            {progress.has(currentCard.id) ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.485 1.929l-1.414-1.414L5.5 7.086 3.414 5l-1.414 1.414L5.5 9.914l8.485-8.485z"/>
                </svg>
                Known
              </>
            ) : (
              'Mark as Known'
            )}
          </button>
          
          {isLastCard && allCardsKnown ? (
            <button 
              className="btn btn-primary" 
              onClick={handleComplete}
            >
              Complete
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.485 1.929l-1.414-1.414L5.5 7.086 3.414 5l-1.414 1.414L5.5 9.914l8.485-8.485z"/>
              </svg>
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="shortcuts-hint">
          <span><kbd>Space</kbd> Flip</span>
          <span><kbd>←</kbd> <kbd>→</kbd> Navigate</span>
          <span><kbd>K</kbd> Mark Known</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};