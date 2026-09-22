export interface Question {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  points: number;
  new_streak: number;
}

export interface QuizState {
  phase: 'start' | 'playing' | 'results';
  currentQuestion: Question | null;
  questionIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  history: { questionId: string; correct: boolean; category: string }[];
  categoryScores: Record<string, { correct: number; total: number }>;
}

export type QuizAction =
  | { type: 'START' }
  | { type: 'SET_QUESTION'; question: Question }
  | { type: 'ANSWER'; result: AnswerResult; question: Question }
  | { type: 'FINISH' };
