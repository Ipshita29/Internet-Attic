export const STORAGE_KEYS = {
  rooms: 'internet-attic:rooms',
  resources: 'internet-attic:resources',
  settings: 'internet-attic:settings',
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function hasStorageKey(key) {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}
