// Flashcard parser utility
export interface Flashcard {
  id: string;
  domain: number;
  subdomain: string;
  front: string;
  back: string;
}

export interface FlashcardSet {
  domain: number;
  subdomain: string;
  cards: Flashcard[];
}

// Parse flashcard text format into structured data
export function parseFlashcards(text: string): Flashcard[] {
  const flashcards: Flashcard[] = [];
  const cards = text.split(/Front:/g).filter(card => card.trim());
  
  cards.forEach((card, index) => {
    const lines = card.trim().split('\n');
    let domain = 1;
    let subdomain = '';
    let front = '';
    let back = '';
    let inBack = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Extract domain/subdomain
      if (trimmedLine.startsWith('Domain/Subdomain:')) {
        const domainStr = trimmedLine.replace('Domain/Subdomain:', '').trim();
        const parts = domainStr.split('.');
        domain = parseInt(parts[0]);
        subdomain = domainStr;
      }
      // Check for Back: marker
      else if (trimmedLine === 'Back:') {
        inBack = true;
      }
      // Add to front or back content
      else if (trimmedLine) {
        if (inBack) {
          back += (back ? '\n' : '') + trimmedLine;
        } else if (!trimmedLine.startsWith('Domain')) {
          front += (front ? '\n' : '') + trimmedLine;
        }
      }
    }
    
    if (front && back) {
      flashcards.push({
        id: `${domain}-${subdomain}-${index}`,
        domain,
        subdomain,
        front: front.trim(),
        back: back.trim()
      });
    }
  });
  
  return flashcards;
}

// Group flashcards by subdomain
export function groupFlashcardsBySubdomain(flashcards: Flashcard[]): Map<string, Flashcard[]> {
  const grouped = new Map<string, Flashcard[]>();
  
  flashcards.forEach(card => {
    const key = card.subdomain;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(card);
  });
  
  return grouped;
}

// Get flashcards for a specific subdomain
export function getFlashcardsForSubdomain(flashcards: Flashcard[], subdomain: string): Flashcard[] {
  // Handle both exact matches and prefix matches
  return flashcards.filter(card => {
    const cardSubdomain = card.subdomain;
    // Exact match or prefix match (e.g., "1.1" matches "1.1.1", "1.1.2", etc.)
    return cardSubdomain === subdomain || cardSubdomain.startsWith(subdomain + '.');
  });
}

// Load all flashcard files
export async function loadAllFlashcards(): Promise<Flashcard[]> {
  const allFlashcards: Flashcard[] = [];
  
  // This would be replaced with actual file loading in production
  // For now, returning empty array as we'll load them on-demand
  return allFlashcards;
}
