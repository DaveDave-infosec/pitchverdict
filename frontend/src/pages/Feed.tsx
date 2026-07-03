import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllResults } from '../lib/genlayer';
import {
  applyFilter,
  getFilterCounts,
  FILTER_META,
  type FilterKey,
} from '../lib/feedFilters';
import { ResultCard } from '../components/feed/ResultCard';
import { FilterTabs } from '../components/feed/FilterTabs';
import type { PitchResult } from '../types';
import './Feed.css';

const POLL_INTERVAL_MS = 30000;

export function Feed() {
  const [results, setResults] = useState<PitchResult[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const fetchAll = async () => {
      try {
        const data = await getAllResults();
        if (!active) return;
        setResults(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Failed to fetch the feed.');
      } finally {
        if (active) { setLoading(false); setHasFetched(true); }
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const counts = getFilterCounts(results);
  const filtered = applyFilter(results, filter);
  const filterMeta = FILTER_META.find((f) => f.key === filter)!;

  return (
    <div className="feed-page">
      <header className="feed-page__header">
        <h1 className="feed-page__title">Feed</h1>
        <p className="feed-page__subtitle">
          Every pitch evaluated on-chain by the six-lens consensus panel, newest first.
        </p>
      </header>

      <FilterTabs current={filter} onSelect={setFilter} counts={counts} />

      {loading && results.length === 0 && (
        <div className="feed-page__state">Loading the feed...</div>
      )}

      {error && !loading && (
        <div className="feed-page__state feed-page__state--error">{error}</div>
      )}

      {hasFetched && !error && filtered.length === 0 && results.length === 0 && (
        <div className="feed-page__state">
          No pitches evaluated yet.{' '}
          <Link to="/pitch" className="feed-page__link">Be the first &rarr;</Link>
        </div>
      )}

      {hasFetched && !error && filtered.length === 0 && results.length > 0 && (
        <div className="feed-page__state">{filterMeta.emptyMessage}</div>
      )}

      <div className="feed-page__list">
        {filtered.map((r) => (
          <ResultCard key={r.result_id} result={r} />
        ))}
      </div>
    </div>
  );
}

export default Feed;