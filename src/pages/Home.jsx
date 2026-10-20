import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';
import SearchField from '../components/common/SearchField';
import RoomCard from '../components/rooms/RoomCard';
import ResourceCard from '../components/resources/ResourceCard';
import Box3D from '../components/common/Box3D';
import { Flower, Leaf, Ornament, Sparkle, Star } from '../components/common/Illustrations';
import ResourceCollection from '../components/resources/ResourceCollection';
import ResultsEmpty from '../components/common/ResultsEmpty';
import Thumbnail from '../components/resources/Thumbnail';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useItemActions } from '../hooks/useItemActions';
import { applyFilters, sortItems, DEFAULT_FILTERS, forgottenDays } from '../utils/resources';
import { timeAgo } from '../utils/dates';

function pickTreasure(items, skipId) {
  const pool = items.filter((i) => i.id !== skipId);
  const list = pool.length ? pool : items;
  if (!list.length) return null;
  // favour things that haven't been opened for a while
  const sorted = [...list].sort((a, b) => forgottenDays(b) - forgottenDays(a));
  return sorted[Math.floor(Math.random() * Math.min(sorted.length, 5))];
}

export default function Home() {
  const { rooms, activeResources, roomsById, view } = useApp();
  const { openAddLink, openRoomForm } = useUI();
  const actions = useItemActions();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [treasureId, setTreasureId] = useState(() => pickTreasure(activeResources.filter((i) => !i.isRead || forgottenDays(i) > 14))?.id ?? null);

  const searching = query.trim().length > 0;
  const results = useMemo(
    () => sortItems(applyFilters(activeResources, roomsById, { ...DEFAULT_FILTERS, query }), 'recent'),
    [activeResources, roomsById, query]
  );
  const recent = useMemo(() => sortItems(activeResources, 'recent').slice(0, 8), [activeResources]);
  const treasure = activeResources.find((i) => i.id === treasureId) || activeResources[0] || null;

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome back!</h1>
          <p className="hero-sub">More good things to discover.</p>
          <p className="tagline">A little home for everything you find.</p>
          <div className="hero-actions">
            <SearchField value={query} onChange={setQuery} className="hero-search" />
            <button type="button" className="btn btn-primary btn-lg" onClick={() => openAddLink()}>
              <Plus size={18} />Add a link
            </button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-glow" />
          <Box3D size="lg" autoOpen label="A treasure chest slowly opening" />
          <span className="float f1"><Ornament box="-14 -14 28 28"><Sparkle s={1.4} /></Ornament></span>
          <span className="float f2"><Ornament box="-14 -14 28 28"><Star s={1.2} fill="#DDBBB3" /></Ornament></span>
          <span className="float f3"><Ornament box="-14 -14 28 28"><Flower s={1.5} /></Ornament></span>
          <span className="float f4"><Ornament box="-20 -34 40 44"><Leaf r={20} s={1.2} /></Ornament></span>
        </div>
      </section>

      {searching ? (
        <section className="section" aria-live="polite">
          <div className="section-head">
            <h2>Search results</h2>
            <span className="muted">{results.length} found for "{query.trim()}"</span>
          </div>
          {results.length ? (
            <ResourceCollection items={results} view={view} />
          ) : (
            <ResultsEmpty hasItems={activeResources.length > 0} onReset={() => setQuery('')} onAdd={() => openAddLink()} />
          )}
        </section>
      ) : (
        <>
          <section className="section">
            <div className="section-head">
              <h2>Your rooms</h2>
              <Link to="/rooms" className="text-link">See all rooms <ArrowRight size={15} /></Link>
            </div>
            <div className="room-grid">
              {rooms.slice(0, 4).map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
              <button type="button" className="room-card-new room-card-new-wide" onClick={() => openRoomForm()}>
                <span className="new-plus"><Plus size={26} /></span>
                <strong>Create a new room</strong>
                <span>A fresh corner for a new obsession.</span>
              </button>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Recently Saved</h2>
              <Link to="/items" className="text-link">View all <ArrowRight size={15} /></Link>
            </div>
            {recent.length ? (
              <div className="resource-grid">{recent.map((item, i) => <ResourceCard key={item.id} item={item} index={i} />)}</div>
            ) : (
              <ResultsEmpty onAdd={() => openAddLink()} emptyTitle="Your attic is waiting" />
            )}
          </section>

          {activeResources.length > 0 && <section className="section">
            <div className="treasure-panel">
              <div className="treasure-intro">
                <h2>A little treasure to revisit</h2>
                <p>Something you saved that deserves a second look.</p>
                <button type="button" className="btn btn-soft" onClick={() => setTreasureId(pickTreasure(activeResources, treasure?.id)?.id)} disabled={activeResources.length < 2}>
                  <Shuffle size={16} />Show another
                </button>
              </div>
              {treasure ? (
                <article className="treasure-card">
                  <Thumbnail item={treasure} className="thumb-sm" />
                  <div className="treasure-text">
                    <span className="muted">{treasure.domain} · saved {timeAgo(treasure.createdAt)}</span>
                    <h3>{treasure.title}</h3>
                    {treasure.description && <p>{treasure.description}</p>}
                    <div className="treasure-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => actions.open(treasure)}>Open link</button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/items/${treasure.id}`)}>View details</button>
                    </div>
                  </div>
                </article>
              ) : (
                <p className="muted">Save a few links and a surprise will appear here.</p>
              )}
            </div>
          </section>}
        </>
      )}
    </div>
  );
}
