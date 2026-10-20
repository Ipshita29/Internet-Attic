import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { openExternal } from '../utils/url';

/** Every resource action in one place so cards, rows, menus and the detail page behave identically. */
export function useItemActions() {
  const app = useApp();
  const ui = useUI();
  const navigate = useNavigate();

  const open = (item) => {
    if (openExternal(item.url)) app.markOpened(item.id);
    else ui.toast('That link could not be opened.', 'error');
  };

  return {
    open,
    view: (item) => navigate(`/items/${item.id}`),
    edit: (item) => ui.openEditItem(item),
    move: (item) => ui.openMove(item),
    toggleFavorite: (item) => {
      app.toggleFavorite(item);
      ui.toast(item.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    },
    toggleRead: (item) => {
      app.toggleRead(item);
      ui.toast(item.isRead ? 'Marked as unread' : 'Marked as read');
    },
    archive: (item) => {
      app.archive(item);
      ui.toast('Tucked away in the archive');
    },
    restore: (item) => {
      app.restore(item);
      ui.toast('Back in the attic');
    },
    dismiss: (item) => {
      app.dismiss(item);
      ui.toast('Dismissed from the queue');
    },
    remove: async (item, { redirect = false } = {}) => {
      const ok = await ui.confirm({
        title: 'Delete this treasure?',
        message: `"${item.title}" will be permanently removed. This cannot be undone.`,
        confirmLabel: 'Delete',
        tone: 'danger',
      });
      if (!ok) return false;
      app.deleteResource(item.id);
      ui.toast('Treasure deleted');
      if (redirect) navigate('/items');
      return true;
    },
  };
}
