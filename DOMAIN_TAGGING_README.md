# CISSP Domain Tagging System

## Overview
This system automatically tags CISSP questions with their appropriate domains based on keyword matching and content analysis. It provides:

- Automatic domain detection and tagging
- Confidence scoring for each tag
- Domain-based question filtering
- Performance analytics and reporting
- Cache system for optimized loading

## Components

### 1. Domain Tagger (`src/lib/questions/domain-tagger.ts`)
- Core tagging logic using keyword matching
- Confidence scoring based on match strength
- Support for batch processing
- Domain statistics generation

### 2. Enhanced Question Parser (`src/lib/questions/question-parser.ts`)
- Integrated domain tagging during parsing
- Support for domain-filtered queries
- Difficulty assessment
- Backwards compatible with existing code

### 3. Cache Generator (`src/scripts/generate-question-cache.ts`)
- Pre-processes all questions with domain tags
- Creates optimized JSON cache files
- Generates domain-specific cache files
- Provides performance analytics

### 4. Domain API Routes (`src/app/api/questions/domain/route.ts`)
- RESTful API for domain-filtered questions
- Support for multiple filter criteria
- Manual domain assignment endpoint
- Real-time statistics

### 5. UI Components
- Domain Quiz Selector for targeted practice
- Visual domain distribution analytics
- Confidence indicators

## Usage

### 1. Generate Question Cache
First, run the cache generation script to tag all questions:

```bash
npm run generate-cache
# or
npx tsx src/scripts/generate-question-cache.ts
```

This creates:
- `/public/data/questions-cache.json` - Complete cache with all questions
- `/public/data/domain-[1-8]-cache.json` - Domain-specific caches
- `/public/data/questions-index.json` - Quick lookup index

### 2. Analyze Domain Distribution
To analyze your current question distribution:

```bash
npm run analyze-domains
# or
npx tsx src/scripts/analyze-domains.ts
```

This generates:
- Console report with statistics
- `domain-analysis-report.txt` - Detailed text report
- `/public/data/tagged-questions.json` - Export for manual review

### 3. Use in Your Application

#### Load questions by domain:
```typescript
import { getQuestionsByDomain } from '@/lib/questions/question-parser'

// Get 20 questions from Domain 1
const domain1Questions = await getQuestionsByDomain(1, 20)

// Get all questions from Domain 3
const domain3Questions = await getQuestionsByDomain(3)
```

#### Get random questions with domain filter:
```typescript
import { getRandomQuestions } from '@/lib/questions/question-parser'

// Get 10 random questions from Domain 5
const questions = await getRandomQuestions(10, 5)
```

#### Use the API endpoint:
```typescript
// Get 20 questions from Domain 2
const response = await fetch('/api/questions/domain?domain=2&count=20')
const data = await response.json()

// Get difficult questions (level 4-5) from Domain 7
const hardQuestions = await fetch('/api/questions/domain?domain=7&difficulty=4,5')

// Get high-confidence questions only
const confidentQuestions = await fetch('/api/questions/domain?minConfidence=80')
```

#### Update domain assignment:
```typescript
// Manually assign a question to a different domain
await fetch('/api/questions/domain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question_id: 42,
    domain_id: 3,
    subdomain_id: 25
  })
})
```

## Domain Keywords

The system uses comprehensive keyword mappings for each CISSP domain:

1. **Security and Risk Management** - risk, compliance, ethics, governance, BCP, etc.
2. **Asset Security** - classification, retention, disposal, privacy, data lifecycle, etc.
3. **Security Architecture** - cryptography, PKI, physical security, models, etc.
4. **Communication & Network** - firewall, VPN, protocols, wireless, attacks, etc.
5. **Identity & Access Management** - authentication, authorization, SSO, privileges, etc.
6. **Security Assessment** - testing, auditing, metrics, SIEM, compliance, etc.
7. **Security Operations** - incident response, forensics, monitoring, recovery, etc.
8. **Software Development** - SDLC, secure coding, OWASP, API security, etc.

## Confidence Scoring

Questions are tagged with confidence scores:
- **80-100%**: High confidence - strong keyword matches
- **60-79%**: Medium confidence - moderate matches
- **Below 60%**: Low confidence - weak matches, may need manual review

## Performance Optimization

The cache system provides:
- **Instant loading** - Pre-processed questions in JSON
- **Memory caching** - In-memory storage with TTL
- **Domain-specific files** - Optimized for domain practice
- **Index file** - Quick lookups and statistics

## Recommendations

After running the analysis, you'll receive recommendations for:
- Questions needing manual domain review (low confidence)
- Domains needing more questions to meet target weights
- Over-represented domains that may need rebalancing

## API Reference

### GET /api/questions/domain

Query Parameters:
- `domain` (1-8): Filter by domain ID
- `count` (default: 10, max: 100): Number of questions
- `difficulty` (1-5): Filter by difficulty level(s)
- `random` (default: true): Randomize results
- `minConfidence` (0-100): Minimum confidence threshold

### POST /api/questions/domain

Update domain assignment for a question.

Body:
```json
{
  "question_id": 123,
  "domain_id": 4,
  "subdomain_id": 29
}
```

## Next Steps

1. **Run cache generation** to tag all questions
2. **Review low-confidence questions** for manual correction
3. **Add domain selector** to your quiz interface
4. **Monitor distribution** to maintain CISSP exam weights
5. **Consider adding more questions** to under-represented domains

## Troubleshooting

If questions aren't being tagged:
1. Ensure cache files exist in `/public/data/`
2. Check that domain-tagger.ts is properly imported
3. Verify keyword mappings match your question content
4. Review low-confidence questions for unusual terminology

For performance issues:
1. Regenerate cache files
2. Check cache TTL settings
3. Consider using domain-specific cache files
4. Monitor API response times
