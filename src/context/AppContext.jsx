import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_ROOMS } from '../data/defaultRooms';
import { STORAGE_KEYS, hasStorageKey, readStorage, writeStorage } from '../utils/storage';
import { buildResource, normalizeTag, normalizeTags, sanitizeResource, sanitizeRoom } from '../utils/resources';
import { createId } from '../utils/ids';
import { urlKey } from '../utils/url';

const AppContext = createContext(null);

function initState() {
  const storedRooms = readStorage(STORAGE_KEYS.rooms, null);
  const storedResources = readStorage(STORAGE_KEYS.resources, null);
  const settings = readStorage(STORAGE_KEYS.settings, {});

  let rooms = Array.isArray(storedRooms) ? storedRooms.map(sanitizeRoom).filter(Boolean) : [];
  let resources = Array.isArray(storedResources) ? storedResources.map(sanitizeResource).filter(Boolean) : [];

  // Starter rooms are only offered on the very first visit, so deleted rooms stay deleted.
  if (!hasStorageKey(STORAGE_KEYS.rooms)) rooms = DEFAULT_ROOMS;
  const ids = new Set();
  resources = resources.filter((r) => !ids.has(r.id) && ids.add(r.id));
  return {
    rooms,
    resources,
    settings: { view: settings?.view === 'list' ? 'list' : 'grid' },
  };
}

function reducer(state, action) {
  const patchItem = (id, fn) => ({
    ...state,
    resources: state.resources.map((r) => (r.id === id ? { ...r, ...fn(r) } : r)),
  });
  switch (action.type) {
    case 'ADD_RESOURCE':
      return { ...state, resources: [action.item, ...state.resources] };
    case 'UPDATE_RESOURCE':
      return patchItem(action.id, () => action.patch);
    case 'DELETE_RESOURCE':
      return { ...state, resources: state.resources.filter((r) => r.id !== action.id) };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.room] };
    case 'UPDATE_ROOM':
      return { ...state, rooms: state.rooms.map((r) => (r.id === action.id ? { ...r, ...action.patch } : r)) };
    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id !== action.id),
        resources: state.resources.map((r) => (r.roomId === action.id ? { ...r, roomId: action.moveTo || '' } : r)),
      };
    case 'RENAME_TAG': {
      const from = action.from;
      const to = action.to;
      return {
        ...state,
        resources: state.resources.map((r) =>
          r.tags.includes(from) ? { ...r, tags: normalizeTags(r.tags.map((t) => (t === from ? to : t))) } : r
        ),
      };
    }
    case 'REMOVE_TAG':
      return {
        ...state,
        resources: state.resources.map((r) => (r.tags.includes(action.tag) ? { ...r, tags: r.tags.filter((t) => t !== action.tag) } : r)),
      };
    case 'SET_VIEW':
      return { ...state, settings: { ...state.settings, view: action.view } };
    case 'RESET':
      return { ...state, rooms: DEFAULT_ROOMS, resources: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.rooms, state.rooms);
    writeStorage(STORAGE_KEYS.resources, state.resources);
    writeStorage(STORAGE_KEYS.settings, state.settings);
  }, [state]);

  // Stay in sync when another tab edits the attic.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEYS.resources || e.key === STORAGE_KEYS.rooms) window.location.reload();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { rooms, resources, settings } = state;
  const roomsById = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);

  const activeResources = useMemo(() => resources.filter((r) => !r.isArchived), [resources]);
  const archivedResources = useMemo(() => resources.filter((r) => r.isArchived), [resources]);

  const roomCounts = useMemo(() => {
    const counts = {};
    activeResources.forEach((r) => {
      const key = roomsById[r.roomId] ? r.roomId : '';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [activeResources, roomsById]);

  const tags = useMemo(() => {
    const map = new Map();
    activeResources.forEach((r) => r.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [activeResources]);

  const allTagNames = useMemo(() => [...new Set(resources.flatMap((r) => r.tags))].sort(), [resources]);

  const findDuplicate = useCallback(
    (url, excludeId) => resources.find((r) => r.id !== excludeId && urlKey(r.url) === urlKey(url)) || null,
    [resources]
  );

  const addResource = useCallback((data) => {
    const item = buildResource({ ...data, id: createId('item'), createdAt: new Date().toISOString() });
    dispatch({ type: 'ADD_RESOURCE', item });
    return item;
  }, []);

  const updateResource = useCallback((id, patch) => {
    const clean = { ...patch };
    if (clean.tags) clean.tags = normalizeTags(clean.tags);
    if (clean.url !== undefined) {
      const rebuilt = buildResource({ ...patch, id });
      clean.url = rebuilt.url;
      clean.domain = rebuilt.domain;
      clean.favicon = rebuilt.favicon;
    }
    dispatch({ type: 'UPDATE_RESOURCE', id, patch: clean });
  }, []);

  const actions = useMemo(
    () => ({
      addResource,
      updateResource,
      deleteResource: (id) => dispatch({ type: 'DELETE_RESOURCE', id }),
      toggleFavorite: (item) => updateResource(item.id, { isFavorite: !item.isFavorite }),
      toggleRead: (item) => updateResource(item.id, { isRead: !item.isRead, isDismissed: false }),
      archive: (item) => updateResource(item.id, { isArchived: true }),
      restore: (item) => updateResource(item.id, { isArchived: false, isDismissed: false }),
      dismiss: (item) => updateResource(item.id, { isDismissed: true }),
      markOpened: (id) => updateResource(id, { lastOpenedAt: new Date().toISOString(), isDismissed: false }),
      moveToRoom: (id, roomId) => updateResource(id, { roomId: roomId || '' }),
      saveNotes: (id, notes) => updateResource(id, { notes }),
      addRoom: (data) => {
        const room = sanitizeRoom({ ...data, id: createId('room'), isDefault: false });
        dispatch({ type: 'ADD_ROOM', room });
        return room;
      },
      updateRoom: (id, data) => {
        const { name, description, accentColor, cover } = data;
        dispatch({ type: 'UPDATE_ROOM', id, patch: sanitizeRoom({ id, name, description, accentColor, cover }) });
      },
      deleteRoom: (id, moveTo) => dispatch({ type: 'DELETE_ROOM', id, moveTo }),
      renameTag: (from, to) => {
        const next = normalizeTag(to);
        if (!next) return { ok: false, reason: 'Tag names cannot be empty.' };
        if (next !== from && allTagNames.includes(next)) return { ok: false, reason: `A tag called "${next}" already exists.` };
        dispatch({ type: 'RENAME_TAG', from, to: next });
        return { ok: true };
      },
      removeTag: (tag) => dispatch({ type: 'REMOVE_TAG', tag }),
      setView: (view) => dispatch({ type: 'SET_VIEW', view }),
      resetAll: () => dispatch({ type: 'RESET' }),
    }),
    [addResource, updateResource, allTagNames]
  );

  const value = useMemo(
    () => ({
      rooms, resources, activeResources, archivedResources, roomsById, roomCounts, tags, allTagNames,
      view: settings.view, findDuplicate, ...actions,
    }),
    [rooms, resources, activeResources, archivedResources, roomsById, roomCounts, tags, allTagNames, settings.view, findDuplicate, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
