import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import Menu from '../common/Menu';
import { useUI } from '../../context/UIContext';
import { RoomIllustration } from '../common/Illustrations';
import TiltCard from '../common/TiltCard';
import { useApp } from '../../context/AppContext';

export default function RoomCard({ room, index = 0 }) {
  const { roomCounts } = useApp();
  const { openRoomForm, openDeleteRoom } = useUI();
  const count = roomCounts[room.id] || 0;
  return (
    <TiltCard className="room-card" style={{ '--accent': room.accentColor, '--i': index }}>
      <Link to={`/rooms/${room.id}`} className="room-card-link" aria-label={`${room.name}, ${count} items`}>
        <div className="room-card-art">
          <div className="room-card-art-inner"><RoomIllustration cover={room.cover} /></div>
          <span className="room-count"><b>{count}</b>{count === 1 ? ' item' : ' items'}</span>
        </div>
        <div className="room-card-body">
          <h3>{room.name}</h3>
          <p>{room.description || 'A room waiting for its first treasure.'}</p>
        </div>
      </Link>
      <div className="room-card-menu">
        <Menu
          label={`Actions for ${room.name}`}
          items={[
            { label: 'Edit room', icon: <Pencil size={16} />, onClick: () => openRoomForm(room) },
            { divider: true },
            { label: 'Delete room', icon: <Trash2 size={16} />, danger: true, onClick: () => openDeleteRoom(room) },
          ]}
        />
      </div>
    </TiltCard>
  );
}
