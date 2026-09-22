import { useState, useEffect, useCallback, useRef } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuestionCard } from './components/QuestionCard';
import { Timer } from './components/Timer';
import { StreakBar } from './components/StreakBar';
import { ResultsScreen } from './components/ResultsScreen';
import { useQuiz } from './hooks/useQuiz';
import { useTimer } from './hooks/useTimer';
import { useLayaDecision } from './hooks/useLayaDecision';
import type { Question, AnswerResult } from './types';
import { DEMO_QUESTIONS } from './data/questions';

const TIME_LIMITS: Record<string, number> = { easy: 15, medium: 10, hard: 7 };

function App() {
  const quiz = useQuiz();
  const timer = useTimer(15);
  const { getDecision, submitAnswer } = useLayaDecision();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [answered, setAnswered] = useState(false);
  const answeringRef = useRef(false);

  useEffect(() => {
    fetch('/api/questions')
      .then((r) => r.json())
      .then(setAllQuestions)
      .catch(() => setAllQuestions(DEMO_QUESTIONS));
  }, []);

  const pickNext = useCallback(async () => {
    if (allQuestions.length === 0) return;
    const cats = [...new Set(allQuestions.map((q) => q.category))];
    const diffs = ['easy', 'medium', 'hard'];
    const stateText = `Score:${quiz.score} Streak:${quiz.streak} History:${quiz.history.map((h) => `${h.category}:${h.correct ? 'W' : 'L'}`).join(',')}`;

    let chosenCat = cats[Math.floor(Math.random() * cats.length)];
    let chosenDiff = 'medium';

    try {
      const catDec = await getDecision(stateText, cats);
      chosenCat = catDec.selected || chosenCat;
      const diffDec = await getDecision(stateText, diffs);
      chosenDiff = diffDec.selected || chosenDiff;
    } catch {}

    const used = new Set(quiz.history.map((h) => h.questionId));
    let pool = allQuestions.filter((q) => q.category === chosenCat && q.difficulty === chosenDiff && !used.has(q.id));
    if (pool.length === 0) pool = allQuestions.filter((q) => !used.has(q.id));
    if (pool.length === 0) { quiz.finish(); return; }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    quiz.setQuestion(pick);
    const limit = TIME_LIMITS[pick.difficulty] || 15;
    timer.reset(limit);
    setSelectedIndex(null);
    setCorrectIndex(null);
    setExplanation(null);
    setAnswered(false);
    answeringRef.current = false;
  }, [allQuestions, quiz, timer, getDecision]);

  useEffect(() => {
    if (quiz.phase === 'playing' && quiz.currentQuestion === null && allQuestions.length > 0) {
      pickNext();
    }
  }, [quiz.phase, quiz.currentQuestion, allQuestions, pickNext]);

  useEffect(() => {
    if (quiz.currentQuestion && quiz.phase === 'playing' && !timer.isRunning && selectedIndex === null && !answered) {
      timer.start(TIME_LIMITS[quiz.currentQuestion.difficulty] || 15);
    }
  }, [quiz.currentQuestion, quiz.phase, timer, selectedIndex, answered]);

  useEffect(() => {
    if (timer.timeLeft === 0 && quiz.currentQuestion && !answered) {
      handleAnswer(-1);
    }
  }, [timer.timeLeft, quiz.currentQuestion, answered]);

  const computeLocalResult = (q: Question, idx: number, timeTaken: number, streak: number): AnswerResult => {
    const correct = idx === q.correctIndex;
    const base = { easy: 100, medium: 200, hard: 300 }[q.difficulty] || 100;
    const speedBonus = Math.max(0, Math.round((15 - timeTaken) * 10));
    const newStreak = correct ? streak + 1 : 0;
    const multiplier = Math.min(newStreak, 5);
    const points = correct ? (base + speedBonus) * Math.max(multiplier, 1) : 0;
    return { correct, correctIndex: q.correctIndex, explanation: q.explanation, points, new_streak: newStreak };
  };

  const handleAnswer = async (index: number) => {
    if (!quiz.currentQuestion || answeringRef.current) return;
    answeringRef.current = true;
    timer.stop();
    setSelectedIndex(index);
    setCorrectIndex(quiz.currentQuestion.correctIndex);
    setAnswered(true);

    const limit = TIME_LIMITS[quiz.currentQuestion.difficulty] || 15;
    const timeTaken = limit - timer.timeLeft;

    let result: AnswerResult;
    try {
      const apiResult = await submitAnswer({
        question_id: quiz.currentQuestion.id,
        selected_index: index,
        time_taken: timeTaken,
        streak: quiz.streak,
      });
      // If backend returned valid result (not demo fallback)
      if (apiResult.correct !== undefined && apiResult.explanation !== 'Backend offline — demo mode') {
        result = apiResult;
      } else {
        result = computeLocalResult(quiz.currentQuestion, index, timeTaken, quiz.streak);
      }
    } catch {
      result = computeLocalResult(quiz.currentQuestion, index, timeTaken, quiz.streak);
    }

    setExplanation(result.explanation);
    quiz.answer(result, quiz.currentQuestion);

    setTimeout(() => {
      if (quiz.questionIndex + 1 >= 10) quiz.finish();
      else pickNext();
    }, 2000);
  };

  if (quiz.phase === 'start') return <StartScreen onStart={quiz.start} />;
  if (quiz.phase === 'results') return <ResultsScreen {...quiz} onRestart={quiz.start} />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4 sm:p-6">
      {quiz.currentQuestion && (
        <>
          <StreakBar
            streak={quiz.streak}
            score={quiz.score}
            questionNum={quiz.questionIndex + 1}
            total={quiz.TOTAL_QUESTIONS}
          />
          <Timer
            timeLeft={timer.timeLeft}
            maxTime={TIME_LIMITS[quiz.currentQuestion.difficulty] || 15}
          />
          <QuestionCard
            question={quiz.currentQuestion}
            onAnswer={handleAnswer}
            disabled={selectedIndex !== null}
            selectedIndex={selectedIndex}
            correctIndex={correctIndex}
            explanation={explanation}
          />
        </>
      )}
    </div>
  );
}

export default App;
