import { Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import RoomCard from '../components/rooms/RoomCard';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';

export default function Rooms() {
  const { rooms, roomCounts } = useApp();
  const { openRoomForm, openAddLink } = useUI();
  const loose = roomCounts[''] || 0;
  return (
    <div className="page">
      <PageHeader
        eyebrow="Little corners for big ideas"
        title="Rooms"
        subtitle="Every collection has a home. Make as many as you like."
        actions={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => openAddLink()}>Add a link</button>
            <button type="button" className="btn btn-primary" onClick={() => openRoomForm()}><Plus size={18} />New room</button>
          </>
        }
      />
      <div className="room-grid">
        {rooms.map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
        <button type="button" className="room-card-new" onClick={() => openRoomForm()}>
          <span className="new-plus"><Plus size={26} /></span>
          <strong>Create a new room</strong>
          <span>Choose a name, color and illustration.</span>
        </button>
      </div>
      {loose > 0 && <p className="muted note-line">{loose} {loose === 1 ? 'link is' : 'links are'} not in a room yet. Find {loose === 1 ? 'it' : 'them'} in All Items under "Uncategorized".</p>}
    </div>
  );
}
