import { useCallback } from 'react';

const API_BASE = '/api';

export function useLayaDecision() {
  const getDecision = useCallback(async (state: string, options: string[]) => {
    const res = await fetch(`${API_BASE}/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, options }),
    });
    return res.json();
  }, []);

  const submitAnswer = useCallback(async (data: {
    question_id: string; selected_index: number; time_taken: number; streak: number;
  }) => {
    const res = await fetch(`${API_BASE}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }, []);

  return { getDecision, submitAnswer };
}
