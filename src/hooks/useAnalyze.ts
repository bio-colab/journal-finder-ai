import { useState } from 'react';
import { SearchPayload, AnalysisResponse } from '../types';

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResponse | null>(null);

  const analyze = async (payload: SearchPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setData(null);
    setError(null);
  };

  return { analyze, data, loading, error, clear };
}
