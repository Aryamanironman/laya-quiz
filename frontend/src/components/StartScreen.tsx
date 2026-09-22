import { motion } from 'framer-motion';

interface Props { onStart: () => void }

export function StartScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 bg-gradient-to-r from-fire via-yellow-400 to-neon bg-clip-text text-transparent">
          LayaQuiz
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-2">Adaptive Trivia Powered by AI</p>
        <p className="text-sm text-gray-500 mb-10">10 questions · Adaptive difficulty · Streak combos</p>
      </motion.div>

      <motion.button
        onClick={onStart}
        className="px-10 py-5 bg-gradient-to-r from-fire to-orange-500 text-white text-xl font-bold rounded-2xl glow-pulse hover:from-orange-500 hover:to-fire transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        🚀 Start Quiz
      </motion.button>

      <motion.div
        className="mt-12 grid grid-cols-3 gap-6 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div>
          <div className="text-2xl mb-1">🧠</div>
          <div>AI-Picked<br/>Questions</div>
        </div>
        <div>
          <div className="text-2xl mb-1">🔥</div>
          <div>Streak<br/>Combos</div>
        </div>
        <div>
          <div className="text-2xl mb-1">⚡</div>
          <div>Speed<br/>Bonus</div>
        </div>
      </motion.div>
    </div>
  );
}
