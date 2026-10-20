import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Thumbnail from './Thumbnail';
import ItemMenu from './ItemMenu';
import TagChip from '../common/TagChip';
import TypeIcon from '../common/TypeIcon';
import { StatusBadge } from './ResourceCard';
import { TYPE_LABELS } from '../../utils/resources';
import { formatDate } from '../../utils/dates';
import { useApp } from '../../context/AppContext';

export default function ResourceRow({ item, extraMenu }) {
  const { roomsById } = useApp();
  const room = roomsById[item.roomId];
  return (
    <div className="resource-row">
      <Link to={`/items/${item.id}`} className="resource-row-main" aria-label={`Open details for ${item.title}`}>
        <Thumbnail item={item} className="thumb-sm" />
        <div className="resource-row-text">
          <h3>
            {item.title}
            {item.isFavorite && <Heart size={14} fill="currentColor" className="inline-fav" aria-label="Favorite" />}
          </h3>
          <div className="resource-domain">
            <img src={item.favicon} alt="" width="14" height="14" />
            <span>{item.domain}</span>
            <span className="dot" aria-hidden="true" />
            <span className="row-type"><TypeIcon type={item.type} size={13} />{TYPE_LABELS[item.type]}</span>
          </div>
          {item.description && <p className="resource-desc">{item.description}</p>}
        </div>
      </Link>
      <div className="resource-row-meta">
        <div className="tag-row">{item.tags.slice(0, 3).map((t) => <TagChip key={t} tag={t} to={`/items?tag=${encodeURIComponent(t)}`} />)}</div>
        <div className="row-info">
          {room && <span className="resource-room"><i style={{ background: room.accentColor }} />{room.name}</span>}
          <span className="row-date">{formatDate(item.createdAt)}</span>
        </div>
      </div>
      <StatusBadge item={item} />
      <ItemMenu item={item} extra={extraMenu} />
    </div>
  );
}
