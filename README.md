# Spanish Conjugation Game

An interactive web application for learning Spanish verb conjugations with gamification elements.

## Overview

This React-based educational game helps users master Spanish verb conjugations through practice, timed challenges, and survival modes. It features a comprehensive database of regular and irregular verbs across four major tenses.

## Features

- **Multiple Game Modes**:
  - Practice Mode: Learn at your own pace
  - Timed Mode: 30-second challenges with bonus points
  - Survival Mode: One mistake ends the game

- **Smart Learning System**:
  - Adaptive difficulty based on user level
  - Spaced repetition for mistakes
  - Accent-aware validation (accepts answers with/without accents)

- **Comprehensive Verb Database**:
  - Regular verbs (-ar, -er, -ir): hablar, comer, vivir
  - Irregular verbs: ser, estar, tener, hacer, ir, poder, decir
  - Four tenses: Present, Preterite, Imperfect, Future

- **Progress Tracking**:
  - Score and streak counters
  - Level progression system
  - Accuracy statistics
  - Mistake review with full conjugation charts

## Tech Stack

- **Frontend**: React 19 with hooks
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: Hot reload with Vite dev server

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Game Mechanics

1. **Question Generation**: Random verb/tense/person combinations
2. **Answer Validation**: Supports both accented and unaccented answers
3. **Scoring**: Base points + time bonus (timed mode)
4. **Hints**: Available with point penalty (-5 pts)
5. **Level System**: Advance every 10 consecutive correct answers
6. **Mistake Learning**: Failed attempts trigger spaced repetition

## For Developers

### Project Structure
```
src/
├── main.tsx           # App entry point
└── SpanishConjugationGame.jsx  # Main game component
```

### Key State Management
- Game state (verb, tense, person, answer)
- User progress (score, streak, level)
- Learning features (mistakes, hints, feedback)
- Game modes and timers

### Verb Database Schema
```javascript
verbs.regular[verb] = {
  type: '-ar|-er|-ir',
  [tense]: { [person]: 'conjugation' }
}

verbs.irregular[verb] = {
  type: 'irregular',
  [tense]: { [person]: 'conjugation' }
}
```

### For LLMs
When analyzing or extending this codebase:
- Main game logic is in `SpanishConjugationGame.jsx`
- State management uses React hooks (useState, useEffect)
- Tailwind classes handle all styling
- Verb conjugations are stored in nested objects
- Game modes affect scoring and timing logic