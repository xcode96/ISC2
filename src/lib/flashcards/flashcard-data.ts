import { Flashcard, FlashcardDeck } from './flashcard-types';
import domain1Flashcards from './domain1-flashcards.json';
import domain2Flashcards from './domain2-flashcards.json';
import domain3Flashcards from './domain3-flashcards.json';
import domain4Flashcards from './domain4-flashcards.json';
import domain5Flashcards from './domain5-flashcards.json';
import domain6Flashcards from './domain6-flashcards.json';
import domain7Flashcards from './domain7-flashcards.json';
import domain8Flashcards from './domain8-flashcards.json';

// Map to store all domain flashcards
const flashcardDecks: Map<number, FlashcardDeck> = new Map([
  [1, domain1Flashcards as FlashcardDeck],
  [2, domain2Flashcards as FlashcardDeck],
  [3, domain3Flashcards as FlashcardDeck],
  [4, domain4Flashcards as FlashcardDeck],
  [5, domain5Flashcards as FlashcardDeck],
  [6, domain6Flashcards as FlashcardDeck],
  [7, domain7Flashcards as FlashcardDeck],
  [8, domain8Flashcards as FlashcardDeck]
  // etc.
]);

/**
 * Get all flashcards for a specific domain
 */
export function getFlashcardsByDomain(domainNumber: number): Flashcard[] {
  const deck = flashcardDecks.get(domainNumber);
  return deck?.flashcards || [];
}

/**
 * Get flashcards filtered by subdomain
 * @param domainNumber - The main domain number (1-8)
 * @param subdomainNumber - The subdomain number (e.g., "1.1", "1.2")
 */
export function getFlashcardsBySubdomain(domainNumber: number, subdomainNumber: string): Flashcard[] {
  const allCards = getFlashcardsByDomain(domainNumber);
  
  // Filter cards that match the subdomain prefix
  // This handles both exact matches (1.1) and more specific matches (1.1.1, 1.1.2)
  return allCards.filter(card => 
    card.domain === subdomainNumber || 
    card.domain.startsWith(`${subdomainNumber}.`)
  );
}

/**
 * Check if flashcards exist for a subdomain
 */
export function hasFlashcardsForSubdomain(domainNumber: number, subdomainNumber: string): boolean {
  return getFlashcardsBySubdomain(domainNumber, subdomainNumber).length > 0;
}

/**
 * Get all unique categories from flashcards
 */
export function getCategories(cards: Flashcard[]): string[] {
  return [...new Set(cards.map(card => card.category))];
}

/**
 * Shuffle flashcards array
 */
export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}