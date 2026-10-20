import { getDomain, normalizeUrl } from './url';
import { makeFavicon } from './thumbnail';
import { createId } from './ids';
import { DAY } from './dates';

export const RESOURCE_TYPES = [
  { value: 'article', label: 'Article', icon: 'BookOpen' },
  { value: 'website', label: 'Website', icon: 'Globe' },
  { value: 'video', label: 'Video', icon: 'Video' },
  { value: 'github', label: 'GitHub repository', icon: 'GitBranch' },
  { value: 'tool', label: 'Tool', icon: 'Wrench' },
  { value: 'design', label: 'Design inspiration', icon: 'Palette' },
  { value: 'other', label: 'Other', icon: 'Link' },
];

export const TYPE_LABELS = Object.fromEntries(RESOURCE_TYPES.map((t) => [t.value, t.label]));

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently saved' },
  { value: 'oldest', label: 'Oldest saved' },
  { value: 'alpha', label: 'Alphabetical' },
  { value: 'opened', label: 'Recently opened' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Any status' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'favorite', label: 'Favorites' },
];

export function normalizeTag(tag) {
  return String(tag || '').trim().replace(/^#/, '').replace(/\s+/g, ' ').toLowerCase().slice(0, 32);
}

export function normalizeTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(',');
  const seen = new Set();
  const out = [];
  list.forEach((t) => {
    const n = normalizeTag(t);
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  });
  return out;
}

/** Builds a complete resource from partial form data. */
export function buildResource(data) {
  const url = normalizeUrl(data.url) || data.url;
  const domain = getDomain(url);
  return {
    id: data.id || createId('item'),
    url,
    title: (data.title || '').trim() || domain || 'Untitled treasure',
    description: (data.description || '').trim(),
    thumbnail: (data.thumbnail || '').trim(),
    domain,
    favicon: data.favicon || makeFavicon(domain),
    type: RESOURCE_TYPES.some((t) => t.value === data.type) ? data.type : 'website',
    roomId: data.roomId || '',
    tags: normalizeTags(data.tags),
    notes: data.notes || '',
    isFavorite: Boolean(data.isFavorite),
    isRead: Boolean(data.isRead),
    isArchived: Boolean(data.isArchived),
    isDismissed: Boolean(data.isDismissed),
    createdAt: data.createdAt || new Date().toISOString(),
    lastOpenedAt: data.lastOpenedAt || null,
  };
}

/** Defensive parse of stored data; returns null for entries that cannot be recovered. */
export function sanitizeResource(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.url !== 'string' || !normalizeUrl(raw.url)) return null;
  const valid = (d) => (typeof d === 'string' && !Number.isNaN(new Date(d).getTime()) ? d : null);
  return buildResource({
    ...raw,
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId('item'),
    title: typeof raw.title === 'string' ? raw.title : '',
    description: typeof raw.description === 'string' ? raw.description : '',
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : '',
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    roomId: typeof raw.roomId === 'string' ? raw.roomId : '',
    createdAt: valid(raw.createdAt) || new Date().toISOString(),
    lastOpenedAt: valid(raw.lastOpenedAt),
  });
}

export function sanitizeRoom(raw) {
  if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string' || !raw.id) return null;
  return {
    id: raw.id,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : 'Untitled room',
    description: typeof raw.description === 'string' ? raw.description : '',
    accentColor: typeof raw.accentColor === 'string' && /^#[0-9a-f]{6}$/i.test(raw.accentColor) ? raw.accentColor : '#D9E0CA',
    cover: typeof raw.cover === 'string' ? raw.cover : 'plant',
    isDefault: Boolean(raw.isDefault),
  };
}

export function matchesQuery(item, roomsById, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const roomName = roomsById[item.roomId]?.name || '';
  const hay = [item.title, item.url, item.domain, item.description, item.notes, roomName, ...item.tags]
    .join(' \n ')
    .toLowerCase();
  return terms.every((term) => hay.includes(term));
}

export const DEFAULT_FILTERS = { query: '', room: 'all', type: 'all', tag: 'all', status: 'all', sort: 'recent' };

export function applyFilters(items, roomsById, f) {
  return items.filter((item) => {
    if (f.room && f.room !== 'all') {
      if (f.room === 'none' ? item.roomId && roomsById[item.roomId] : item.roomId !== f.room) return false;
    }
    if (f.type && f.type !== 'all' && item.type !== f.type) return false;
    if (f.tag && f.tag !== 'all' && !item.tags.includes(f.tag)) return false;
    if (f.status === 'unread' && item.isRead) return false;
    if (f.status === 'read' && !item.isRead) return false;
    if (f.status === 'favorite' && !item.isFavorite) return false;
    return matchesQuery(item, roomsById, f.query || '');
  });
}

export function sortItems(items, sort) {
  const list = [...items];
  const t = (d) => (d ? new Date(d).getTime() : 0);
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => t(a.createdAt) - t(b.createdAt));
    case 'alpha':
      return list.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    case 'opened':
      return list.sort((a, b) => t(b.lastOpenedAt) - t(a.lastOpenedAt) || t(b.createdAt) - t(a.createdAt));
    default:
      return list.sort((a, b) => t(b.createdAt) - t(a.createdAt));
  }
}

/** Age of an item in days for the revisit queue: since last opened, otherwise since saved. */
export function forgottenDays(item, now = Date.now()) {
  const last = item.lastOpenedAt || item.createdAt;
  return Math.max(0, Math.floor((now - new Date(last).getTime()) / DAY));
}

export function isQueued(item, now = Date.now()) {
  if (item.isArchived || item.isDismissed) return false;
  return !item.isRead || forgottenDays(item, now) >= 30;
}
