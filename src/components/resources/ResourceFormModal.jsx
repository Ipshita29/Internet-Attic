import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import TagChip from '../common/TagChip';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';
import { RESOURCE_TYPES, normalizeTag } from '../../utils/resources';
import { getDomain, guessType, normalizeUrl, suggestTitle } from '../../utils/url';

/** One modal for adding and editing links. */
export default function ResourceFormModal({ mode, item, defaults = {}, onClose }) {
  const { rooms, addResource, updateResource, findDuplicate, allTagNames } = useApp();
  const { toast, openEditItem } = useUI();
  const navigate = useNavigate();
  const editing = mode === 'edit';
  const initial = editing ? item : defaults;

  const [form, setForm] = useState({
    url: initial.url || '',
    title: initial.title || '',
    description: initial.description || '',
    roomId: initial.roomId || '',
    type: initial.type || 'website',
    notes: initial.notes || '',
    thumbnail: initial.thumbnail || '',
  });
  const [tags, setTags] = useState(initial.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [touched, setTouched] = useState({ title: editing, type: editing });
  const [error, setError] = useState('');

  const normalized = useMemo(() => normalizeUrl(form.url), [form.url]);
  const duplicate = normalized ? findDuplicate(normalized, editing ? item.id : undefined) : null;
  const domain = normalized ? getDomain(normalized) : '';

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onUrlChange = (value) => {
    setError('');
    setForm((f) => {
      const next = { ...f, url: value };
      const n = normalizeUrl(value);
      if (n && !touched.title) next.title = suggestTitle(n);
      if (n && !touched.type) next.type = guessType(n);
      return next;
    });
  };

  const addTag = (raw) => {
    const t = normalizeTag(raw);
    if (t && !tags.includes(t)) setTags((list) => [...list, t]);
    setTagInput('');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.url.trim()) return setError('Please paste a link to save.');
    if (!normalized) return setError('That does not look like a valid link. Use an http:// or https:// address.');
    if (duplicate) return setError('This link is already in your attic.');
    if (form.thumbnail.trim() && !/^https?:\/\//i.test(form.thumbnail.trim())) return setError('Thumbnail must be an http(s) image address.');
    const finalTags = tagInput.trim() ? [...tags, normalizeTag(tagInput)] : tags;
    const payload = { ...form, url: normalized, title: form.title.trim() || suggestTitle(normalized), tags: finalTags };
    if (editing) {
      updateResource(item.id, payload);
      toast('Changes saved');
    } else {
      const created = addResource(payload);
      toast(`Saved "${created.title}"`);
    }
    onClose();
  };

  const suggestions = allTagNames.filter((t) => !tags.includes(t) && t.includes(normalizeTag(tagInput))).slice(0, 6);

  return (
    <Modal
      title={editing ? 'Edit treasure' : 'Add a link'}
      subtitle={editing ? 'Polish the details of this saved link.' : 'Tuck something good into the attic.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" form="resource-form" className="btn btn-primary">{editing ? 'Save changes' : 'Save to attic'}</button>
        </>
      }
    >
      <form id="resource-form" className="form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="rf-url">Link <em>required</em></label>
          <input id="rf-url" data-autofocus type="url" inputMode="url" placeholder="https://example.com/a-lovely-article" value={form.url} onChange={(e) => onUrlChange(e.target.value)} aria-invalid={Boolean(error)} autoComplete="off" />
          {domain && !error && <small className="hint">Saving from <strong>{domain}</strong>. Previews are not fetched automatically, so add a title or image if you like.</small>}
          {error && <small className="field-error" role="alert">{error}</small>}
          {duplicate && (
            <div className="duplicate-note" role="alert">
              <strong>Already saved:</strong> {duplicate.title}
              <div>
                <button type="button" className="btn btn-sm btn-soft" onClick={() => { onClose(); navigate(`/items/${duplicate.id}`); }}>Open it</button>
                {!editing && <button type="button" className="btn btn-sm btn-soft" onClick={() => openEditItem(duplicate)}>Edit it</button>}
              </div>
            </div>
          )}
        </div>
        <div className="field">
          <label htmlFor="rf-title">Title</label>
          <input id="rf-title" type="text" value={form.title} placeholder="A readable name" onChange={(e) => { setTouched((t) => ({ ...t, title: true })); setField('title', e.target.value); }} />
        </div>
        <div className="field">
          <label htmlFor="rf-desc">Description</label>
          <textarea id="rf-desc" rows={2} value={form.description} placeholder="What makes this worth keeping?" onChange={(e) => setField('description', e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="rf-room">Room</label>
            <select id="rf-room" value={form.roomId} onChange={(e) => setField('roomId', e.target.value)}>
              <option value="">Uncategorized</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rf-type">Resource type</label>
            <select id="rf-type" value={form.type} onChange={(e) => { setTouched((t) => ({ ...t, type: true })); setField('type', e.target.value); }}>
              {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="rf-tags">Tags</label>
          <div className="tag-input">
            {tags.map((t) => <TagChip key={t} tag={t} onRemove={() => setTags(tags.filter((x) => x !== t))} />)}
            <input
              id="rf-tags"
              list="rf-tag-suggestions"
              value={tagInput}
              placeholder={tags.length ? 'Add another' : 'Type a tag, press Enter'}
              onChange={(e) => setTagInput(e.target.value.includes(',') ? (addTag(e.target.value.split(',')[0]), '') : e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
                if (e.key === 'Backspace' && !tagInput && tags.length) setTags(tags.slice(0, -1));
              }}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
            />
            <datalist id="rf-tag-suggestions">{suggestions.map((t) => <option key={t} value={t} />)}</datalist>
          </div>
        </div>
        <div className="field">
          <label htmlFor="rf-notes">Personal note</label>
          <textarea id="rf-notes" rows={3} value={form.notes} placeholder="Why did you save this? What to remember?" onChange={(e) => setField('notes', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="rf-thumb">Thumbnail URL <em>optional</em></label>
          <input id="rf-thumb" type="url" inputMode="url" placeholder="https://.../cover.jpg" value={form.thumbnail} onChange={(e) => setField('thumbnail', e.target.value)} />
        </div>
      </form>
    </Modal>
  );
}
