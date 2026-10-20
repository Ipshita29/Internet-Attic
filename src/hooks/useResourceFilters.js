import { useMemo, useState } from 'react';
import { DEFAULT_FILTERS, applyFilters, sortItems } from '../utils/resources';
import { useApp } from '../context/AppContext';

export function useResourceFilters(items, initial = {}) {
  const { roomsById } = useApp();
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initial });
  const set = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const reset = () => setFilters({ ...DEFAULT_FILTERS, ...initial });

  const results = useMemo(
    () => sortItems(applyFilters(items, roomsById, filters), filters.sort),
    [items, roomsById, filters]
  );
  const isFiltered = ['query', 'room', 'type', 'tag', 'status'].some((k) => filters[k] !== DEFAULT_FILTERS[k] && filters[k] !== (initial[k] ?? DEFAULT_FILTERS[k]));
  return { filters, set, reset, results, isFiltered, setFilters };
}
