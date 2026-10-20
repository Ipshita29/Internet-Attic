import { ArrowUpDown, FilterX } from 'lucide-react';
import SearchField from '../common/SearchField';
import ViewToggle from '../common/ViewToggle';
import { RESOURCE_TYPES, SORT_OPTIONS, STATUS_OPTIONS } from '../../utils/resources';
import { useApp } from '../../context/AppContext';

function Select({ label, value, onChange, children, icon }) {
  return (
    <label className="select">
      <span className="sr-only">{label}</span>
      {icon}
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>{children}</select>
    </label>
  );
}

/** Search, filters, sort and layout toggle shared by All Items, Room details and Archive. */
export default function ResourceToolbar({ state, items, hideRoom = false, showView = true, placeholder }) {
  const { filters, set, reset, isFiltered } = state;
  const { rooms, view, setView } = useApp();
  const tagOptions = [...new Set(items.flatMap((i) => i.tags))].sort();

  return (
    <div className="toolbar">
      <SearchField value={filters.query} onChange={(v) => set('query', v)} placeholder={placeholder} className="toolbar-search" />
      <div className="toolbar-controls">
        {!hideRoom && (
          <Select label="Filter by room" value={filters.room} onChange={(v) => set('room', v)}>
            <option value="all">All rooms</option>
            {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            <option value="none">Uncategorized</option>
          </Select>
        )}
        <Select label="Filter by type" value={filters.type} onChange={(v) => set('type', v)}>
          <option value="all">All types</option>
          {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
        <Select label="Filter by tag" value={filters.tag} onChange={(v) => set('tag', v)}>
          <option value="all">All tags</option>
          {filters.tag !== 'all' && !tagOptions.includes(filters.tag) && <option value={filters.tag}>#{filters.tag}</option>}
          {tagOptions.map((t) => <option key={t} value={t}>#{t}</option>)}
        </Select>
        <Select label="Filter by reading status" value={filters.status} onChange={(v) => set('status', v)}>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        <Select label="Sort by" value={filters.sort} onChange={(v) => set('sort', v)} icon={<ArrowUpDown size={15} aria-hidden="true" />}>
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        {isFiltered && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={reset}><FilterX size={15} />Clear</button>
        )}
        {showView && <ViewToggle value={view} onChange={setView} />}
      </div>
    </div>
  );
}
