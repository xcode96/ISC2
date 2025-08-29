# CISSP Flashcard Implementation Guide

## Files Created

1. **domain1-flashcards.json** - Structured JSON with all 17 flashcards from Domain 1
2. **flashcard-types.ts** - TypeScript interfaces and utility functions
3. **FlashcardComponent.tsx** - React component with flip animation
4. **FlashcardComponent.css** - Styles including 3D flip effect

## Data Structure

Each flashcard contains:
- `id`: Unique identifier
- `domain`: CISSP domain/subdomain number
- `category`: Topic category (e.g., "Security Concepts", "Professional Ethics")
- `front`: Question text
- `back`: Answer text

## Features Implemented

### Core Functionality
- 3D flip animation on click (similar to CodePen example)
- Previous/Next navigation
- Progress tracking (mark cards as known)
- Card counter display

### Additional Features
- Shuffle mode
- Domain filtering (filter by subdomain)
- Progress bar visualization
- Keyboard shortcuts support
- Responsive design
- Dark mode support

## Integration Steps

### 1. Install in Next.js Project

```bash
# Copy files to your components directory
cp FlashcardComponent.tsx /your-project/components/
cp FlashcardComponent.css /your-project/components/
cp flashcard-types.ts /your-project/lib/

# Copy data file to public directory
cp domain1-flashcards.json /your-project/public/data/flashcards/
```

### 2. Basic Usage

```tsx
// In your page component
import { FlashcardApp } from '@/components/FlashcardComponent';

export default function StudyPage() {
  return <FlashcardApp />;
}
```

### 3. Custom Implementation

```tsx
import { useState, useEffect } from 'react';
import { FlashcardComponent } from '@/components/FlashcardComponent';
import { FlashcardDeck } from '@/lib/flashcard-types';

export default function CustomStudyPage() {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);

  useEffect(() => {
    fetch('/data/flashcards/domain1-flashcards.json')
      .then(res => res.json())
      .then(setDeck);
  }, []);

  if (!deck) return <div>Loading...</div>;

  return (
    <FlashcardComponent 
      deck={deck}
      shuffle={true}
      domainFilter="1.3" // Only show Security Governance cards
    />
  );
}
```

## Keyboard Shortcuts

Add this to FlashcardComponent.tsx for keyboard support:

```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
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
}, [currentIndex, isFlipped]);
```

## Database Integration (Supabase)

To persist progress in Supabase:

```tsx
// Create table in Supabase
CREATE TABLE flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  card_id TEXT NOT NULL,
  known BOOLEAN DEFAULT false,
  last_reviewed TIMESTAMP DEFAULT NOW(),
  review_count INTEGER DEFAULT 0
);

// In your component
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

const saveProgress = async (cardId: string, known: boolean) => {
  const { data, error } = await supabase
    .from('flashcard_progress')
    .upsert({ 
      card_id: cardId, 
      known,
      review_count: { inc: 1 }
    });
};
```

## Adding More Domains

Simply create additional JSON files following the same structure:
- domain2-flashcards.json
- domain3-flashcards.json
- etc.

Then combine them in your app:

```tsx
const loadAllDomains = async () => {
  const domains = await Promise.all([
    fetch('/data/flashcards/domain1-flashcards.json'),
    fetch('/data/flashcards/domain2-flashcards.json'),
    // ... more domains
  ]);
  
  const decks = await Promise.all(domains.map(r => r.json()));
  return {
    domain: "All CISSP Domains",
    flashcards: decks.flatMap(d => d.flashcards)
  };
};
```

## Customization Options

### Change flip animation speed
In CSS, modify: `transition: transform 0.6s;`

### Change card dimensions
In CSS, modify: `height: 400px;`

### Add categories filter
Already included in utility functions - use `getCategories()` to build a filter UI

### Add spaced repetition
Track review dates and implement algorithm based on `flashcard_progress` table

## Notes
- Flashcards are responsive and mobile-friendly
- Dark mode automatically adapts to system preferences
- All text with bullet points is properly formatted with line breaks
- JSON structure is easily extensible for additional metadata