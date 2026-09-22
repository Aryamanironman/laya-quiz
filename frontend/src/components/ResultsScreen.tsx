import { motion } from 'framer-motion';
import type { QuizState } from '../types';

interface Props extends QuizState { onRestart: () => void }

export function ResultsScreen({ score, bestStreak, history, categoryScores, onRestart }: Props) {
  const totalCorrect = history.filter((h) => h.correct).length;
  const accuracy = history.length > 0 ? ((totalCorrect / history.length) * 100).toFixed(0) : '0';

  const getGrade = () => {
    const pct = Number(accuracy);
    if (pct >= 90) return { label: 'S', color: 'text-yellow-400', glow: 'drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]' };
    if (pct >= 70) return { label: 'A', color: 'text-neon', glow: 'drop-shadow-[0_0_20px_rgba(0,255,136,0.5)]' };
    if (pct >= 50) return { label: 'B', color: 'text-blue-400', glow: '' };
    return { label: 'C', color: 'text-gray-400', glow: '' };
  };
  const grade = getGrade();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white p-4 sm:p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className={`text-8xl sm:text-9xl font-black ${grade.color} ${grade.glow} mb-2`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          {grade.label}
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-1">Quiz Complete!</h1>
        <p className="text-gray-400">Here's how you did</p>
      </motion.div>

      <motion.div
        className="text-6xl sm:text-7xl font-extrabold text-neon mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        {score}
        <span className="text-lg text-gray-400 font-normal ml-2">pts</span>
      </motion.div>

      <motion.div
        className="flex gap-6 sm:gap-10 mb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-card px-5 py-4 rounded-xl border border-gray-800/50">
          <div className="text-3xl font-bold text-white">{accuracy}%</div>
          <div className="text-xs text-gray-500 mt-1">Accuracy</div>
        </div>
        <div className="bg-card px-5 py-4 rounded-xl border border-gray-800/50">
          <div className="text-3xl font-bold text-fire">{bestStreak}</div>
          <div className="text-xs text-gray-500 mt-1">Best Streak</div>
        </div>
        <div className="bg-card px-5 py-4 rounded-xl border border-gray-800/50">
          <div className="text-3xl font-bold text-white">{totalCorrect}/{history.length}</div>
          <div className="text-xs text-gray-500 mt-1">Correct</div>
        </div>
      </motion.div>

      {Object.keys(categoryScores).length > 0 && (
        <motion.div
          className="w-full max-w-sm mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
          <div className="space-y-2">
            {Object.entries(categoryScores).map(([cat, data]) => (
              <div key={cat} className="flex items-center justify-between bg-card px-4 py-2.5 rounded-lg border border-gray-800/50">
                <span className="capitalize text-sm text-gray-300">{cat.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon rounded-full"
                      style={{ width: `${(data.correct / data.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-neon">{data.correct}/{data.total}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button
        onClick={onRestart}
        className="px-10 py-4 bg-gradient-to-r from-fire to-orange-500 text-white text-lg font-bold rounded-2xl glow-pulse hover:from-orange-500 hover:to-fire transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        🔄 Play Again
      </motion.button>
    </div>
  );
}
