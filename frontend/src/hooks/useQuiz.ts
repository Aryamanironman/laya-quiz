import { useReducer, useCallback } from 'react';
import type { QuizState, QuizAction, AnswerResult, Question } from '../types';

const TOTAL_QUESTIONS = 10;

const INITIAL_STATE: QuizState = {
  phase: 'start',
  currentQuestion: null,
  questionIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  history: [],
  categoryScores: {},
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START':
      return { ...INITIAL_STATE, phase: 'playing' };
    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.question };
    case 'ANSWER': {
      const { result, question } = action;
      const cs = { ...state.categoryScores };
      if (!cs[question.category]) cs[question.category] = { correct: 0, total: 0 };
      cs[question.category].total++;
      if (result.correct) cs[question.category].correct++;
      return {
        ...state,
        score: state.score + result.points,
        streak: result.new_streak,
        bestStreak: Math.max(state.bestStreak, result.new_streak),
        history: [...state.history, { questionId: question.id, correct: result.correct, category: question.category }],
        categoryScores: cs,
        questionIndex: state.questionIndex + 1,
      };
    }
    case 'FINISH':
      return { ...state, phase: 'results', currentQuestion: null };
    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);
  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const setQuestion = useCallback((q: Question) => dispatch({ type: 'SET_QUESTION', question: q }), []);
  const answer = useCallback((r: AnswerResult, q: Question) => dispatch({ type: 'ANSWER', result: r, question: q }), []);
  const finish = useCallback(() => dispatch({ type: 'FINISH' }), []);
  const isFinished = state.questionIndex >= TOTAL_QUESTIONS;
  return { ...state, start, setQuestion, answer, finish, isFinished, TOTAL_QUESTIONS };
}
