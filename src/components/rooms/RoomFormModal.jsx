import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Modal from '../common/Modal';
import { COVER_OPTIONS, RoomIllustration } from '../common/Illustrations';
import { PASTELS } from '../../utils/colors';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';

export default function RoomFormModal({ room, onClose }) {
  const { addRoom, updateRoom, rooms } = useApp();
  const { toast } = useUI();
  const navigate = useNavigate();
  const editing = Boolean(room);
  const [form, setForm] = useState({
    name: room?.name || '',
    description: room?.description || '',
    accentColor: room?.accentColor || PASTELS[2].value,
    cover: room?.cover || 'plant',
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Give your room a name.');
    if (rooms.some((r) => r.id !== room?.id && r.name.toLowerCase() === name.toLowerCase())) return setError('A room with that name already exists.');
    if (editing) {
      updateRoom(room.id, { ...form, name });
      toast('Room updated');
    } else {
      const created = addRoom({ ...form, name });
      toast(`Created ${created.name}`);
      navigate(`/rooms/${created.id}`);
    }
    onClose();
  };

  return (
    <Modal
      title={editing ? 'Edit room' : 'Create a new room'}
      subtitle="Rooms are cozy little collections for related links."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" form="room-form" className="btn btn-primary">{editing ? 'Save room' : 'Create room'}</button>
        </>
      }
    >
      <form id="room-form" className="form" onSubmit={submit} noValidate>
        <div className="room-preview" style={{ '--accent': form.accentColor }}>
          <RoomIllustration cover={form.cover} />
        </div>
        <div className="field">
          <label htmlFor="room-name">Room name</label>
          <input id="room-name" data-autofocus value={form.name} maxLength={40} placeholder="e.g. Recipe Cupboard" onChange={(e) => { setError(''); set('name', e.target.value); }} aria-invalid={Boolean(error)} />
          {error && <small className="field-error" role="alert">{error}</small>}
        </div>
        <div className="field">
          <label htmlFor="room-desc">Description</label>
          <textarea id="room-desc" rows={2} maxLength={120} value={form.description} placeholder="What lives in this room?" onChange={(e) => set('description', e.target.value)} />
        </div>
        <fieldset className="field">
          <legend>Accent color</legend>
          <div className="swatches">
            {PASTELS.map((c) => (
              <button key={c.value} type="button" className={`swatch ${form.accentColor === c.value ? 'is-selected' : ''}`} style={{ background: c.value }} aria-label={c.name} aria-pressed={form.accentColor === c.value} data-tip={c.name} onClick={() => set('accentColor', c.value)}>
                {form.accentColor === c.value && <Check size={16} />}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>Cover illustration</legend>
          <div className="cover-picker">
            {COVER_OPTIONS.map((c) => (
              <button key={c.value} type="button" className={`cover-option ${form.cover === c.value ? 'is-selected' : ''}`} aria-pressed={form.cover === c.value} aria-label={c.label} data-tip={c.label} onClick={() => set('cover', c.value)}>
                <RoomIllustration cover={c.value} />
              </button>
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
