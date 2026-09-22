import { motion } from 'framer-motion';

interface Props { streak: number; score: number; questionNum: number; total: number }

export function StreakBar({ streak, score, questionNum, total }: Props) {
  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto mb-6 px-2">
      <div className="text-gray-500 text-sm font-medium">
        Q{questionNum}/{total}
      </div>
      <div className="flex items-center gap-2">
        {streak >= 3 && (
          <motion.span
            className="text-2xl fire-bounce"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            🔥
          </motion.span>
        )}
        {streak > 0 && (
          <motion.span
            className="text-white font-bold text-lg"
            key={streak}
            initial={{ scale: 1.4, color: '#ff6b35' }}
            animate={{ scale: 1, color: '#ffffff' }}
          >
            ×{streak}
          </motion.span>
        )}
      </div>
      <motion.div
        className="text-neon text-2xl font-extrabold"
        key={score}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
      >
        {score}
      </motion.div>
    </div>
  );
}
