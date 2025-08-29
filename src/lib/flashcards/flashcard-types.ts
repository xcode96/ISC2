// Flashcard data types for CISSP study platform
export interface Flashcard {
  id: string;
  domain: string;
  category: string;
  front: string;
  back: string;
}

export interface FlashcardDeck {
  domain: string;
  flashcards: Flashcard[];
}

// Helper function to load flashcards
export async function loadFlashcards(path: string): Promise<FlashcardDeck> {
  const response = await fetch(path);
  return response.json();
}

// Shuffle function for randomizing cards
export function shuffleCards(cards: Flashcard[]): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Filter cards by domain/subdomain
export function filterByDomain(cards: Flashcard[], domainPrefix: string): Flashcard[] {
  return cards.filter(card => card.domain.startsWith(domainPrefix));
}

// Get all unique categories
export function getCategories(cards: Flashcard[]): string[] {
  return [...new Set(cards.map(card => card.category))];
}