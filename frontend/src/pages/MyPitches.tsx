import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPitches } from '../lib/genlayer';
import { useWallet } from '../hooks/useWallet';
import {
  applyFilter,
  getFilterCounts,
  FILTER_META,
  type FilterKey,
} from '../lib/feedFilters';
import { ResultCard } from '../components/feed/ResultCard';
import { FilterTabs } from '../components/feed/FilterTabs';
import type { PitchResult } from '../types';
import './MyPitches.css';

const POLL_INTERVAL_MS = 30000;

export function MyPitches() {
  const { account } = useWallet();
  const [results, setResults] = useState<PitchResult[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!account) {
      setLoading(false);
      setResults([]);
      setHasFetched(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setResults([]);
    setError(null);
    const fetchMine = async () => {
      try {
        const data = await getMyPitches(account);
        if (!active) return;
        setResults(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Failed to fetch your pitches.');
      } finally {
        if (active) { setLoading(false); setHasFetched(true); }
      }
    };
    fetchMine();
    const interval = setInterval(fetchMine, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [account]);

  if (!account) {
    return (
      <div className="my-pitches-page">
        <header className="my-pitches-page__header">
          <h1 className="my-pitches-page__title">My Pitches</h1>
          <p className="my-pitches-page__subtitle">
            Pitches submitted from your connected wallet.
          </p>
        </header>
        <div className="my-pitches-page__state">
          Connect your wallet from the header to see pitches you have submitted.
        </div>
      </div>
    );
  }

  const counts = getFilterCounts(results);
  const filtered = applyFilter(results, filter);
  const filterMeta = FILTER_META.find((f) => f.key === filter)!;
  const shortAddr = `${account.slice(0, 6)}…${account.slice(-4)}`;

  return (
    <div className="my-pitches-page">
      <header className="my-pitches-page__header">
        <h1 className="my-pitches-page__title">My Pitches</h1>
        <p className="my-pitches-page__subtitle">
          Pitches submitted from <span className="my-pitches-page__addr">{shortAddr}</span>
        </p>
      </header>

      <FilterTabs current={filter} onSelect={setFilter} counts={counts} />

      {loading && results.length === 0 && (
        <div className="my-pitches-page__state">Loading your pitches…</div>
      )}

      {error && !loading && (
        <div className="my-pitches-page__state my-pitches-page__state--error">{error}</div>
      )}

      {hasFetched && !error && filtered.length === 0 && results.length === 0 && (
        <div className="my-pitches-page__state">
          No pitches from this wallet yet.{' '}
          <Link to="/pitch" className="my-pitches-page__link">Submit one →</Link>
        </div>
      )}

      {hasFetched && !error && filtered.length === 0 && results.length > 0 && (
        <div className="my-pitches-page__state">{filterMeta.emptyMessage}</div>
      )}

      <div className="my-pitches-page__list">
        {filtered.map((r) => (
          <ResultCard key={r.result_id} result={r} />
        ))}
      </div>
    </div>
  );
}

export default MyPitches;