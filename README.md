# 🧠 LayaQuiz

Adaptive trivia powered by [Laya](https://github.com/NandhaKishorM/laya)'s AI decision engine.

**🎮 [Play Live](https://aryamanironman.github.io/laya-quiz/)**

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

- **Laya** (421M param open-source model) acts as the game master
- Each round, Laya picks the next **category + difficulty** based on your performance
- Faster answers = more points
- Streaks multiply your score
- 10 questions per game, adaptive difficulty throughout

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Python, FastAPI, Laya |
| AI Engine | Laya (convaiinnovations/laya-typed-decisions) |

## Features

- 🧠 AI-picked questions based on your performance
- 🔥 Streak combos with multiplied scores
- ⚡ Speed bonus for fast answers
- 📊 Category breakdown at the end
- 🎮 Game-show vibe with animations
