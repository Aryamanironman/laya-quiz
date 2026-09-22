import { motion } from 'framer-motion';

interface Props { timeLeft: number; maxTime: number }

export function Timer({ timeLeft, maxTime }: Props) {
  const pct = (timeLeft / maxTime) * 100;
  const color = timeLeft > maxTime * 0.5 ? '#00ff88' : timeLeft > maxTime * 0.25 ? '#ffaa00' : '#ff3333';

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Time</span>
        <motion.span
          style={{ color }}
          key={timeLeft}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="font-bold"
        >
          {timeLeft}s
        </motion.span>
      </div>
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
