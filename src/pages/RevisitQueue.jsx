import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Archive, Check, EyeOff, ExternalLink, Shuffle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Thumbnail from '../components/resources/Thumbnail';
import ItemMenu from '../components/resources/ItemMenu';
import EmptyState from '../components/common/EmptyState';
import TagChip from '../components/common/TagChip';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useItemActions } from '../hooks/useItemActions';
import { forgottenDays, isQueued } from '../utils/resources';
import { timeAgo } from '../utils/dates';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'older', label: 'Older' },
];

function inRange(days, range) {
  if (range === 'week') return days <= 7;
  if (range === 'month') return days > 7 && days <= 30;
  if (range === 'older') return days > 30;
  return true;
}

export default function RevisitQueue() {
  const { activeResources, resources } = useApp();
  const { toast } = useUI();
  const a = useItemActions();
  const navigate = useNavigate();
  const [range, setRange] = useState('all');

  const now = Date.now();
  const queue = useMemo(
    () => activeResources.filter((i) => isQueued(i)).sort((x, y) => forgottenDays(y) - forgottenDays(x)),
    [activeResources]
  );
  const counts = Object.fromEntries(FILTERS.map((f) => [f.value, queue.filter((i) => inRange(forgottenDays(i, now), f.value)).length]));
  const shown = queue.filter((i) => inRange(forgottenDays(i, now), range));
  const dismissedCount = resources.filter((r) => r.isDismissed && !r.isArchived).length;

  const pickRandom = () => {
    const pool = activeResources;
    if (!pool.length) return toast('Your attic has no treasures yet.', 'error');
    const choice = pool[Math.floor(Math.random() * pool.length)];
    toast(`Here's one: ${choice.title}`);
    navigate(`/items/${choice.id}`);
  };

  const extra = [{ label: 'Dismiss from queue', icon: <EyeOff size={16} />, run: (act, item) => act.dismiss(item) }];

  return (
    <div className="page">
      <PageHeader
        eyebrow="Revisit Queue"
        title="Forgotten treasures"
        subtitle="Good things are worth finding twice."
        actions={<button type="button" className="btn btn-primary" onClick={pickRandom}><Shuffle size={18} />Pick a random treasure</button>}
      />
      <div className="chip-filters" role="tablist" aria-label="Filter by age">
        {FILTERS.map((f) => (
          <button key={f.value} type="button" role="tab" aria-selected={range === f.value} className={`chip-filter ${range === f.value ? 'is-active' : ''}`} onClick={() => setRange(f.value)}>
            {f.label}<b>{counts[f.value]}</b>
          </button>
        ))}
      </div>

      {shown.length ? (
        <ul className="queue-list">
          {shown.map((item, i) => {
            const days = forgottenDays(item, now);
            return (
              <li key={item.id} className="queue-item" style={{ '--i': Math.min(i, 10) }}>
                <Link to={`/items/${item.id}`} className="queue-media" aria-label={`Details for ${item.title}`}><Thumbnail item={item} /></Link>
                <div className="queue-body">
                  <div className="queue-meta">
                    <span className={`age-badge ${days > 30 ? 'old' : days > 7 ? 'mid' : 'new'}`}>
                      {item.lastOpenedAt ? `Opened ${timeAgo(item.lastOpenedAt)}` : `Saved ${timeAgo(item.createdAt)}, never opened`}
                    </span>
                    <span className="muted">{item.domain}</span>
                  </div>
                  <h3><Link to={`/items/${item.id}`}>{item.title}</Link></h3>
                  {item.description && <p className="resource-desc">{item.description}</p>}
                  <div className="tag-row">{item.tags.slice(0, 3).map((t) => <TagChip key={t} tag={t} to={`/items?tag=${encodeURIComponent(t)}`} />)}</div>
                </div>
                <div className="queue-actions">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => a.open(item)}><ExternalLink size={15} />Open</button>
                  <button type="button" className="btn btn-soft btn-sm" onClick={() => a.toggleRead(item)} disabled={item.isRead} title={item.isRead ? 'Already read' : undefined}><Check size={15} />Mark read</button>
                  <button type="button" className="btn btn-soft btn-sm" onClick={() => a.archive(item)}><Archive size={15} />Archive</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => a.dismiss(item)}><EyeOff size={15} />Dismiss</button>
                  <ItemMenu item={item} extra={extra} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title={queue.length ? 'Nothing in this window' : 'All caught up'} >
          {queue.length ? 'Try another time range to see more forgotten treasures.' : 'Everything has been read or opened recently. New unread links will show up here.'}
        </EmptyState>
      )}
      {dismissedCount > 0 && <p className="muted note-line">{dismissedCount} dismissed {dismissedCount === 1 ? 'item stays' : 'items stay'} safe in All Items. Opening or marking {dismissedCount === 1 ? 'it' : 'them'} unread brings {dismissedCount === 1 ? 'it' : 'them'} back.</p>}
    </div>
  );
}
