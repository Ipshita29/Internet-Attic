import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import SearchField from '../components/common/SearchField';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import IconButton from '../components/common/IconButton';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { tagTone } from '../utils/colors';

function RenameModal({ tag, onClose }) {
  const { renameTag } = useApp();
  const { toast } = useUI();
  const [value, setValue] = useState(tag);
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const res = renameTag(tag, value);
    if (!res.ok) return setError(res.reason);
    toast(`Renamed to #${value.trim().replace(/^#/, '').toLowerCase()}`);
    onClose();
  };
  return (
    <Modal size="sm" title="Rename tag" subtitle={`Every item tagged #${tag} will be updated.`} onClose={onClose}
      footer={<><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button type="submit" form="rename-form" className="btn btn-primary">Rename</button></>}>
      <form id="rename-form" className="form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="tag-name">New name</label>
          <input id="tag-name" data-autofocus value={value} maxLength={32} onChange={(e) => { setValue(e.target.value); setError(''); }} aria-invalid={Boolean(error)} />
          {error && <small className="field-error" role="alert">{error}</small>}
        </div>
      </form>
    </Modal>
  );
}

export default function Tags() {
  const { tags, removeTag } = useApp();
  const { confirm, toast } = useUI();
  const [query, setQuery] = useState('');
  const [renaming, setRenaming] = useState(null);

  const shown = useMemo(() => tags.filter((t) => t.name.includes(query.trim().toLowerCase().replace(/^#/, ''))), [tags, query]);
  const max = Math.max(1, ...tags.map((t) => t.count));

  const remove = async (tag) => {
    const ok = await confirm({
      title: `Remove #${tag.name}?`,
      message: `The tag will be taken off ${tag.count} ${tag.count === 1 ? 'item' : 'items'}. The items themselves stay in your attic.`,
      confirmLabel: 'Remove tag',
      tone: 'danger',
    });
    if (ok) {
      removeTag(tag.name);
      toast(`Removed #${tag.name}`);
    }
  };

  return (
    <div className="page">
      <PageHeader eyebrow="Little labels" title="Tags" subtitle="Everything you've labelled, at a glance." />
      <div className="toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search tags..." label="Search tags" className="toolbar-search" /></div>
      {shown.length ? (
        <ul className="tag-grid">
          {shown.map((tag, i) => {
            const tone = tagTone(tag.name);
            return (
              <li key={tag.name} className="tag-card" style={{ '--tone-bg': tone.bg, '--tone-fg': tone.fg, '--i': Math.min(i, 12) }}>
                <Link to={`/items?tag=${encodeURIComponent(tag.name)}`} className="tag-card-link" aria-label={`${tag.count} items tagged ${tag.name}`}>
                  <span className="tag-card-name"><span aria-hidden="true">#</span>{tag.name}</span>
                  <span className="tag-card-count"><b>{tag.count}</b> {tag.count === 1 ? 'item' : 'items'}</span>
                  <span className="tag-bar"><i style={{ width: `${(tag.count / max) * 100}%` }} /></span>
                </Link>
                <div className="tag-card-actions">
                  <IconButton label={`Rename ${tag.name}`} onClick={() => setRenaming(tag.name)}><Pencil size={16} /></IconButton>
                  <IconButton label={`Remove ${tag.name}`} onClick={() => remove(tag)}><Trash2 size={16} /></IconButton>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState kind={tags.length ? 'search' : 'box'} title={tags.length ? 'No tags match' : 'No tags yet'}>
          {tags.length ? 'Try a different spelling.' : 'Add tags when saving a link and they will gather here.'}
        </EmptyState>
      )}
      {renaming && <RenameModal key={renaming} tag={renaming} onClose={() => setRenaming(null)} />}
    </div>
  );
}
