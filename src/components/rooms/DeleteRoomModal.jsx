import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { useUI } from '../../context/UIContext';

export default function DeleteRoomModal({ room, onClose }) {
  const { rooms, resources, deleteRoom } = useApp();
  const { toast } = useUI();
  const navigate = useNavigate();
  const count = resources.filter((r) => r.roomId === room.id).length;
  const [target, setTarget] = useState('');

  const submit = (e) => {
    e.preventDefault();
    deleteRoom(room.id, target);
    toast(`Deleted ${room.name}. Your links are safe.`);
    onClose();
    navigate('/rooms');
  };

  return (
    <Modal
      size="sm"
      tone="danger"
      title={`Delete ${room.name}?`}
      subtitle="The room goes away, but your links never will."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Keep room</button>
          <button type="submit" form="delete-room-form" className="btn btn-danger">Delete room</button>
        </>
      }
    >
      <form id="delete-room-form" onSubmit={submit} className="form">
        {count > 0 ? (
          <div className="field">
            <label htmlFor="move-target">{count} saved {count === 1 ? 'link' : 'links'} will be kept. Where should {count === 1 ? 'it' : 'they'} go?</label>
            <select id="move-target" data-autofocus value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">Leave uncategorized</option>
              {rooms.filter((r) => r.id !== room.id).map((r) => <option key={r.id} value={r.id}>Move to {r.name}</option>)}
            </select>
          </div>
        ) : (
          <p className="confirm-text">This room is empty, so nothing needs to move.</p>
        )}
      </form>
    </Modal>
  );
}
