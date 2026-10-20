import { Archive, ArchiveRestore, Check, CircleDashed, ExternalLink, Eye, FolderInput, Heart, Pencil, Trash2 } from 'lucide-react';
import Menu from '../common/Menu';
import { useItemActions } from '../../hooks/useItemActions';

export default function ItemMenu({ item, extra = [] }) {
  const a = useItemActions();
  const s = 16;
  const items = [
    { label: 'View details', icon: <Eye size={s} />, onClick: () => a.view(item) },
    { label: 'Open link', icon: <ExternalLink size={s} />, onClick: () => a.open(item) },
    { label: 'Edit', icon: <Pencil size={s} />, onClick: () => a.edit(item) },
    { label: 'Move to room', icon: <FolderInput size={s} />, onClick: () => a.move(item) },
    { label: item.isFavorite ? 'Remove favorite' : 'Add to favorites', icon: <Heart size={s} />, onClick: () => a.toggleFavorite(item) },
    { label: item.isRead ? 'Mark as unread' : 'Mark as read', icon: item.isRead ? <CircleDashed size={s} /> : <Check size={s} />, onClick: () => a.toggleRead(item) },
    ...extra.map((e) => ({ ...e, onClick: () => e.run(a, item) })),
    { divider: true },
    item.isArchived
      ? { label: 'Restore', icon: <ArchiveRestore size={s} />, onClick: () => a.restore(item) }
      : { label: 'Archive', icon: <Archive size={s} />, onClick: () => a.archive(item) },
    { label: 'Delete', icon: <Trash2 size={s} />, danger: true, onClick: () => a.remove(item) },
  ];
  return <Menu items={items} label={`Actions for ${item.title}`} />;
}
