import EmptyState from './EmptyState';

/** Shared "nothing found" panel for filtered lists. */
export default function ResultsEmpty({ hasItems, onReset, onAdd, emptyTitle = 'Nothing here yet', emptyText = 'Save your first link and it will land right here.' }) {
  if (hasItems) {
    return (
      <EmptyState kind="search" title="No treasures match that" action={<button type="button" className="btn btn-soft" onClick={onReset}>Clear search and filters</button>}>
        Try different words, or loosen a filter. Search covers titles, links, notes, tags and rooms.
      </EmptyState>
    );
  }
  return (
    <EmptyState title={emptyTitle} action={onAdd && <button type="button" className="btn btn-primary" onClick={onAdd}>Add a link</button>}>
      {emptyText}
    </EmptyState>
  );
}
