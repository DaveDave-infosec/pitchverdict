import { FILTER_META, type FilterKey } from '../../lib/feedFilters';
import './FilterTabs.css';

interface FilterTabsProps {
  current: FilterKey;
  onSelect: (key: FilterKey) => void;
  counts: Record<FilterKey, number>;
}

export function FilterTabs({ current, onSelect, counts }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="tablist">
      {FILTER_META.map((meta) => (
        <button
          key={meta.key}
          role="tab"
          aria-selected={current === meta.key}
          className={`filter-tab ${current === meta.key ? 'filter-tab--active' : ''}`}
          onClick={() => onSelect(meta.key)}
        >
          <span className="filter-tab__label">{meta.label}</span>
          <span className="filter-tab__count">{counts[meta.key]}</span>
        </button>
      ))}
    </div>
  );
}