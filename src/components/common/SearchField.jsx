import { Search, X } from 'lucide-react';

export default function SearchField({ value, onChange, placeholder = 'Search your attic...', label = 'Search', className = '' }) {
  return (
    <label className={`search-field ${className}`}>
      <Search size={18} aria-hidden="true" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} />
      {value && (
        <button type="button" aria-label="Clear search" data-tip="Clear" onClick={() => onChange('')}>
          <X size={16} />
        </button>
      )}
    </label>
  );
}
