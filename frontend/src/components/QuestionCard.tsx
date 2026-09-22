import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

interface Props {
  question: Question;
  onAnswer: (index: number) => void;
  disabled: boolean;
  selectedIndex: number | null;
  correctIndex: number | null;
  explanation: string | null;
}

export function QuestionCard({ question, onAnswer, disabled, selectedIndex, correctIndex, explanation }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        className="w-full max-w-2xl mx-auto bg-card rounded-2xl p-5 sm:p-8 shadow-2xl border border-gray-800/50"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {question.category.replace('_', ' ')}
          </span>
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <h2 className="text-lg sm:text-xl text-white font-semibold mb-6 leading-relaxed">
          {question.question}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, i) => {
            let style = 'bg-gray-800/80 hover:bg-gray-700/80 text-white border border-gray-700/50';
            if (selectedIndex !== null) {
              if (i === correctIndex) style = 'bg-green-800/80 text-white border border-green-500/50';
              else if (i === selectedIndex) style = 'bg-red-800/80 text-white border border-red-500/50';
              else style = 'bg-gray-800/40 text-gray-500 border border-gray-800/30';
            }
            return (
              <motion.button
                key={i}
                onClick={() => !disabled && onAnswer(i)}
                disabled={disabled}
                className={`px-5 py-3.5 rounded-xl text-left font-medium transition-all duration-200 ${style}`}
                whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <span className="mr-3 text-gray-400 font-bold">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </motion.button>
            );
          })}
        </div>

        {explanation && (
          <motion.div
            className="mt-5 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <p className="text-sm text-gray-300">
              <span className="text-neon font-bold">💡 </span>{explanation}
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
