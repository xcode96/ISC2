# CISSP Study Platform

A free, privacy-focused study platform for CISSP certification preparation with 900+ practice questions across all 8 domains.

## Overview

This platform provides comprehensive CISSP exam preparation with no signup required, no user tracking, and completely free access. Built as a static web application, it runs entirely in your browser with all progress stored locally.

## Features

- **900+ Practice Questions** covering all 8 CISSP domains
- **No Registration Required** - Start practicing immediately
- **Question Tracking System** - Prevents question repetition during practice sessions
- **Multiple Quiz Modes** - Quick practice (30 questions), full exam simulation (150 questions), or custom configuration
- **Domain-Specific Practice** - Focus on individual domains or subdomains
- **Difficulty Filtering** - Practice with questions at your skill level (Levels 1-5)
- **Progress Tracking** - Visual indicators show your coverage of the question bank
- **Timed Practice** - Optional countdown timer for exam simulation
- **Mobile Optimized** - Fully responsive design for practice on any device
- **Offline Capable** - Once loaded, works without internet connection
- **Local Storage Only** - All data stays in your browser

## Technical Architecture

### Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages / Static hosting
- **Data Storage**: Browser localStorage
- **Question Source**: Static text files (no database required)

### Privacy-First Design
- No user accounts or authentication
- No analytics or tracking scripts
- No external API calls for user data
- All progress stored locally in browser
- Questions loaded from static files

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cissp-study-platform.git
cd cissp-study-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Access the platform**
```
Open browser to http://localhost:3000
```

## Building for Production

### Static Export
```bash
npm run build
npm run export
```

The static files will be generated in the `out` directory.

### GitHub Pages Deployment
```bash
npm run deploy:github
```

This command builds the project and prepares it for GitHub Pages deployment.

### Vercel/Netlify Deployment
The platform can be deployed to any static hosting service:

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy

## Project Structure

```
/src
  /app              # Next.js app router pages
    /quiz           # Quiz functionality
    /domains        # Domain information pages
    /progress       # Progress tracking
  /components       # React components
    QuizQuestion.tsx
    QuizResults.tsx
    QuizSelection.tsx
    QuestionProgress.tsx
    MultiQuestionCard.tsx
  /lib              # Utility functions
    static-questions.ts   # Question loader
    question-tracker.ts   # Tracking system
    localStorage.ts       # Progress storage
  /types            # TypeScript definitions
/public
  /data
    /questions      # Question text files (900+ questions)
```

## Question Management

Questions are stored as static text files in `/public/data/questions/`:
- questions1-100.txt
- questions100-200.txt
- questions200-300.txt
- (etc...)

### Question Format
```
1. Question text here?
a. Option A
b. Option B
c. Option C
d. Option D
Answer: b. Correct answer explanation
```

## Local Storage Schema

The platform uses browser localStorage to track:

### Question Tracking
```javascript
{
  cissp_seen_questions: {
    questionIds: [1, 5, 23, ...],
    lastUpdated: timestamp,
    totalQuestions: 245
  },
  cissp_seen_questions_expiry: timestamp
}
```

### Progress Data
```javascript
{
  quiz_attempts: [...],
  domain_performance: {...},
  total_questions_answered: 0,
  average_score: 0,
  best_score: 0,
  last_attempt_date: null
}
```

## Features in Detail

### Question Tracking System
- Automatically tracks which questions have been shown
- Prevents repetition until 80% of questions have been seen
- Auto-resets after 7 days to keep content fresh
- Manual reset option available through UI

### Quiz Modes
1. **Quick Practice**: 30 random questions from entire bank
2. **Full Exam**: 150 questions with 3-hour timer
3. **Custom Quiz**: Configure domain, difficulty, question count, and time limit

### Domain Coverage
All 8 CISSP domains with weighted representation:
1. Security and Risk Management (15%)
2. Asset Security (10%)
3. Security Architecture and Engineering (13%)
4. Communication and Network Security (13%)
5. Identity and Access Management (13%)
6. Security Assessment and Testing (12%)
7. Security Operations (13%)
8. Software Development Security (11%)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Initial load: ~200KB gzipped
- Question loading: <100ms
- No external API calls after initial load
- Works offline once cached
- Instant question navigation

## Contributing

### Adding Questions
1. Edit the appropriate text file in `/public/data/questions/`
2. Follow the existing format exactly
3. Ensure 4 options per question
4. Include clear explanations
5. Submit pull request

### Code Contributions
1. Fork the repository
2. Create feature branch
3. Follow TypeScript and React best practices
4. Add tests if applicable
5. Submit pull request with description

### Bug Reports
Please report issues through GitHub Issues with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Development Commands

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run type-check    # TypeScript validation

# Testing
npm run test          # Run test suite
npm run test:watch    # Run tests in watch mode

# Deployment
npm run export        # Generate static files
npm run deploy:github # Deploy to GitHub Pages
```

## Support

This platform is provided free of charge for the security community. If you find it valuable, consider:
- Contributing questions or improvements
- Reporting bugs or suggesting features
- Sharing with others preparing for CISSP
- Starring the repository on GitHub

## License

MIT License - Free to use, modify, and distribute.

## Acknowledgments

Built by and for the information security community. Special thanks to all contributors who have submitted questions, reported bugs, and suggested improvements.

## Disclaimer

This is an independent study tool and is not affiliated with, endorsed by, or connected to (ISC)² or the official CISSP certification program. CISSP is a registered trademark of (ISC)².

---

For issues, questions, or contributions, please visit the GitHub repository.