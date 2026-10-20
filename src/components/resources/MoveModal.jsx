import { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';

export default function MoveModal({ item, onClose }) {
  const { rooms, moveToRoom, roomsById } = useApp();
  const { toast } = useUI();
  const [roomId, setRoomId] = useState(roomsById[item.roomId] ? item.roomId : '');

  const submit = (e) => {
    e.preventDefault();
    moveToRoom(item.id, roomId);
    toast(roomId ? `Moved to ${roomsById[roomId].name}` : 'Moved to Uncategorized');
    onClose();
  };

  return (
    <Modal
      size="sm"
      title="Move to a room"
      subtitle={item.title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" form="move-form" className="btn btn-primary">Move</button>
        </>
      }
    >
      <form id="move-form" onSubmit={submit} className="radio-list">
        {[{ id: '', name: 'Uncategorized', accentColor: '#E2D5C2' }, ...rooms].map((r) => (
          <label key={r.id || 'none'} className={`radio-row ${roomId === r.id ? 'is-selected' : ''}`}>
            <input type="radio" name="room" value={r.id} checked={roomId === r.id} onChange={() => setRoomId(r.id)} data-autofocus={roomId === r.id || undefined} />
            <i style={{ background: r.accentColor }} />
            <span>{r.name}</span>
          </label>
        ))}
      </form>
    </Modal>
  );
}
