import { useCallback } from 'react';

const API_BASE = '/api';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useLayaDecision() {
  const getDecision = useCallback(async (state: string, options: string[]) => {
    try {
      const res = await fetch(`${API_BASE}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, options }),
      });
      if (!res.ok) throw new Error('Backend unavailable');
      return res.json();
    } catch {
      // Demo mode: random pick
      return { selected: pickRandom(options), scores: Object.fromEntries(options.map(o => [o, 1 / options.length])) };
    }
  }, []);

  const submitAnswer = useCallback(async (data: {
    question_id: string; selected_index: number; time_taken: number; streak: number;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Backend unavailable');
      return res.json();
    } catch {
      // Demo mode: compute locally
      return { correct: false, correctIndex: 0, explanation: 'Backend offline — demo mode', points: 0, new_streak: 0 };
    }
  }, []);

  return { getDecision, submitAnswer };
}
