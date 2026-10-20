import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Thumbnail from './Thumbnail';
import ItemMenu from './ItemMenu';
import TagChip from '../common/TagChip';
import TypeIcon from '../common/TypeIcon';
import TiltCard from '../common/TiltCard';
import { TYPE_LABELS } from '../../utils/resources';
import { useApp } from '../../context/AppContext';

export function StatusBadge({ item }) {
  return <span className={`status ${item.isRead ? 'is-read' : 'is-unread'}`}>{item.isRead ? 'Read' : 'Unread'}</span>;
}

export default function ResourceCard({ item, extraMenu, index = 0 }) {
  const { roomsById } = useApp();
  const room = roomsById[item.roomId];
  return (
    <TiltCard className="resource-card" max={4} style={{ '--i': Math.min(index, 12) }}>
      <Link to={`/items/${item.id}`} className="resource-card-link" aria-label={`Open details for ${item.title}`}>
        <div className="resource-card-media">
          <Thumbnail item={item} />
          <span className="type-pill"><TypeIcon type={item.type} />{TYPE_LABELS[item.type]}</span>
          {item.isFavorite && <span className="fav-flag" aria-label="Favorite"><Heart size={14} fill="currentColor" /></span>}
        </div>
        <div className="resource-card-body">
          <div className="resource-domain">
            <img src={item.favicon} alt="" width="16" height="16" />
            <span>{item.domain}</span>
          </div>
          <h3>{item.title}</h3>
          {room && <div className="resource-room"><i style={{ background: room.accentColor }} />{room.name}</div>}
        </div>
      </Link>
      <div className="resource-card-foot">
        <div className="tag-row">
          {item.tags.slice(0, 2).map((t) => <TagChip key={t} tag={t} to={`/items?tag=${encodeURIComponent(t)}`} />)}
          {item.tags.length > 2 && <span className="tag-more">+{item.tags.length - 2}</span>}
        </div>
        <StatusBadge item={item} />
      </div>
      <div className="resource-card-menu"><ItemMenu item={item} extra={extraMenu} /></div>
    </TiltCard>
  );
}
