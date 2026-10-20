import { Link, useParams } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import ResourceToolbar from '../components/resources/ResourceToolbar';
import ResourceCollection from '../components/resources/ResourceCollection';
import ResultsEmpty from '../components/common/ResultsEmpty';
import { RoomIllustration } from '../components/common/Illustrations';
import NotFound from './NotFound';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useResourceFilters } from '../hooks/useResourceFilters';

export default function RoomDetails() {
  const { roomId } = useParams();
  const { roomsById, activeResources, view } = useApp();
  const { openAddLink, openRoomForm, openDeleteRoom } = useUI();
  const room = roomsById[roomId];
  const roomItems = useMemo(() => activeResources.filter((r) => r.roomId === roomId), [activeResources, roomId]);
  const state = useResourceFilters(roomItems);

  if (!room) return <NotFound title="That room doesn't exist" text="It may have been deleted. Your links are safe in All Items." backTo="/rooms" backLabel="Back to rooms" />;

  return (
    <div className="page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/rooms">Rooms</Link><span aria-hidden="true">/</span><span aria-current="page">{room.name}</span></nav>
      <section className="room-hero" style={{ '--accent': room.accentColor }}>
        <div className="room-hero-art"><RoomIllustration cover={room.cover} /></div>
        <div className="room-hero-text">
          <PageHeader
            title={room.name}
            subtitle={room.description || 'A room waiting for its first treasure.'}
            actions={
              <>
                <button type="button" className="btn btn-primary" onClick={() => openAddLink({ roomId: room.id })}><Plus size={18} />Add link</button>
                <button type="button" className="btn btn-ghost" onClick={() => openRoomForm(room)}><Pencil size={16} />Edit room</button>
                <button type="button" className="btn btn-ghost btn-danger-text" onClick={() => openDeleteRoom(room)}><Trash2 size={16} />Delete room</button>
              </>
            }
          />
          <span className="room-count-pill">{roomItems.length} {roomItems.length === 1 ? 'item' : 'items'}</span>
        </div>
      </section>
      <ResourceToolbar state={state} items={roomItems} hideRoom placeholder={`Search ${room.name}...`} />
      {state.results.length ? (
        <ResourceCollection items={state.results} view={view} />
      ) : (
        <ResultsEmpty hasItems={roomItems.length > 0} onReset={state.reset} onAdd={() => openAddLink({ roomId: room.id })} emptyTitle="This room is empty" emptyText="Add a link and it will settle in here." />
      )}
    </div>
  );
}
