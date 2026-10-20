import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Archive, ArchiveRestore, Check, CircleDashed, ExternalLink, FolderInput, Heart, Pencil, Trash2 } from 'lucide-react';
import Box3D from '../components/common/Box3D';
import TagChip from '../components/common/TagChip';
import TypeIcon from '../components/common/TypeIcon';
import Thumbnail from '../components/resources/Thumbnail';
import NotFound from './NotFound';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useItemActions } from '../hooks/useItemActions';
import { TYPE_LABELS } from '../utils/resources';
import { formatDate, timeAgo } from '../utils/dates';

function NotesEditor({ item }) {
  const { saveNotes } = useApp();
  const [value, setValue] = useState(item.notes);
  const [state, setState] = useState('saved');
  const timer = useRef(null);
  const latest = useRef(value);

  // Persist after a short pause, and flush when leaving the page.
  const commit = (text) => {
    saveNotes(item.id, text);
    setState('saved');
  };
  const onChange = (e) => {
    const text = e.target.value;
    latest.current = text;
    setValue(text);
    setState('saving');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => commit(text), 500);
  };
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (latest.current !== item.notes) saveNotes(item.id, latest.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <section className="notes-card">
      <div className="notes-head">
        <h2>Personal notes</h2>
        <span className={`save-state ${state}`} aria-live="polite">{state === 'saving' ? 'Saving...' : 'Saved'}</span>
      </div>
      <textarea value={value} onChange={onChange} onBlur={() => { window.clearTimeout(timer.current); if (latest.current !== item.notes) commit(latest.current); }} rows={6} placeholder="Why did you keep this? What should you remember?" aria-label="Personal notes" />
    </section>
  );
}

function TagEditor({ item }) {
  const { updateResource } = useApp();
  const [input, setInput] = useState('');
  const add = () => {
    const t = input.trim();
    if (t) updateResource(item.id, { tags: [...item.tags, t] });
    setInput('');
  };
  return (
    <div className="tag-input">
      {item.tags.map((t) => <TagChip key={t} tag={t} onRemove={() => updateResource(item.id, { tags: item.tags.filter((x) => x !== t) })} />)}
      <input value={input} placeholder="Add tag" aria-label="Add a tag" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }} onBlur={add} />
    </div>
  );
}

export default function ItemDetails() {
  const { itemId } = useParams();
  const { resources, roomsById } = useApp();
  const { toast } = useUI();
  const a = useItemActions();
  const item = resources.find((r) => r.id === itemId);

  if (!item) return <NotFound title="That treasure isn't here" text="It may have been deleted or the link is mistyped." backTo="/items" backLabel="Browse all items" />;

  const room = roomsById[item.roomId];
  const s = 17;

  return (
    <div className="page item-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/items">All Items</Link><span aria-hidden="true">/</span>
        {room && <><Link to={`/rooms/${room.id}`}>{room.name}</Link><span aria-hidden="true">/</span></>}
        <span aria-current="page">{item.title}</span>
      </nav>

      <div className="item-layout">
        <div className="item-main">
          <div className="item-stage">
            <Thumbnail item={item} className="thumb-lg" />
            <div className="item-chest" aria-hidden="true"><Box3D key={item.id} autoOpen size="sm" spin={false} label="Treasure chest" /></div>
          </div>
          <div className="item-heading">
            <div className="item-domain"><img src={item.favicon} alt="" width="18" height="18" />{item.domain}<span className="dot" aria-hidden="true" /><TypeIcon type={item.type} />{TYPE_LABELS[item.type]}</div>
            <h1>{item.title}</h1>
            {item.description ? <p className="item-desc">{item.description}</p> : <p className="item-desc muted">No description yet. Edit this item to add one.</p>}
          </div>
          <div className="item-actions">
            <button type="button" className="btn btn-primary" onClick={() => a.open(item)}><ExternalLink size={s} />Open link</button>
            <button type="button" className="btn btn-soft" onClick={() => a.edit(item)}><Pencil size={s} />Edit</button>
            <button type="button" className={`btn btn-soft ${item.isFavorite ? 'is-on' : ''}`} onClick={() => a.toggleFavorite(item)} aria-pressed={item.isFavorite}><Heart size={s} fill={item.isFavorite ? 'currentColor' : 'none'} />{item.isFavorite ? 'Favorited' : 'Favorite'}</button>
            <button type="button" className="btn btn-soft" onClick={() => a.toggleRead(item)}>{item.isRead ? <CircleDashed size={s} /> : <Check size={s} />}{item.isRead ? 'Mark unread' : 'Mark read'}</button>
            <button type="button" className="btn btn-soft" onClick={() => a.move(item)}><FolderInput size={s} />Move</button>
            {item.isArchived ? (
              <button type="button" className="btn btn-soft" onClick={() => a.restore(item)}><ArchiveRestore size={s} />Restore</button>
            ) : (
              <button type="button" className="btn btn-soft" onClick={() => { a.archive(item); toast('Find it again in the Archive'); }}><Archive size={s} />Archive</button>
            )}
            <button type="button" className="btn btn-ghost btn-danger-text" onClick={() => a.remove(item, { redirect: true })}><Trash2 size={s} />Delete</button>
          </div>
          <NotesEditor key={item.id} item={item} />
        </div>

        <aside className="item-side" aria-label="Details">
          <dl className="detail-list">
            <div><dt>Status</dt><dd><span className={`status ${item.isRead ? 'is-read' : 'is-unread'}`}>{item.isRead ? 'Read' : 'Unread'}</span>{item.isArchived && <span className="status is-archived">Archived</span>}</dd></div>
            <div><dt>Room</dt><dd>{room ? <Link to={`/rooms/${room.id}`} className="text-link">{room.name}</Link> : 'Uncategorized'}</dd></div>
            <div><dt>Saved</dt><dd>{formatDate(item.createdAt)}<small>{timeAgo(item.createdAt)}</small></dd></div>
            <div><dt>Last opened</dt><dd>{item.lastOpenedAt ? <>{formatDate(item.lastOpenedAt)}<small>{timeAgo(item.lastOpenedAt)}</small></> : 'Not opened yet'}</dd></div>
            <div><dt>Link</dt><dd className="break"><a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); a.open(item); }}>{item.url}</a></dd></div>
            <div><dt>Tags</dt><dd><TagEditor item={item} /></dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
