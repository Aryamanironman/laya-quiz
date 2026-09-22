interface Props { difficulty: string }

const colors: Record<string, string> = {
  easy: 'bg-green-900/60 text-green-300 border border-green-700/50',
  medium: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
  hard: 'bg-red-900/60 text-red-300 border border-red-700/50',
};

export function DifficultyBadge({ difficulty }: Props) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[difficulty] || ''}`}>
      {difficulty}
    </span>
  );
}
