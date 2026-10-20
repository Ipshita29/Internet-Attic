import { ArchiveRestore, Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import ResourceToolbar from '../components/resources/ResourceToolbar';
import ResourceCollection from '../components/resources/ResourceCollection';
import ResultsEmpty from '../components/common/ResultsEmpty';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useResourceFilters } from '../hooks/useResourceFilters';

export default function Archive() {
  const { archivedResources, view, updateResource, deleteResource } = useApp();
  const { confirm, toast } = useUI();
  const state = useResourceFilters(archivedResources);

  const restoreAll = () => {
    state.results.forEach((i) => updateResource(i.id, { isArchived: false, isDismissed: false }));
    toast(`Restored ${state.results.length} ${state.results.length === 1 ? 'item' : 'items'}`);
  };
  const emptyArchive = async () => {
    const ok = await confirm({
      title: 'Permanently delete archived items?',
      message: `${state.results.length} ${state.results.length === 1 ? 'item' : 'items'} will be deleted for good. This cannot be undone.`,
      confirmLabel: 'Delete forever',
      tone: 'danger',
    });
    if (ok) {
      state.results.forEach((i) => deleteResource(i.id));
      toast('Archive cleared');
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Tucked away"
        title="Archive"
        subtitle="Out of sight, never out of mind. Restore anything any time."
        actions={archivedResources.length > 0 && state.results.length > 0 && (
          <>
            <button type="button" className="btn btn-soft" onClick={restoreAll}><ArchiveRestore size={17} />Restore {state.isFiltered ? 'matches' : 'all'}</button>
            <button type="button" className="btn btn-ghost btn-danger-text" onClick={emptyArchive}><Trash2 size={17} />Delete {state.isFiltered ? 'matches' : 'all'}</button>
          </>
        )}
      />
      {archivedResources.length > 0 && <ResourceToolbar state={state} items={archivedResources} placeholder="Search the archive..." />}
      {state.results.length ? (
        <ResourceCollection items={state.results} view={view} />
      ) : (
        <ResultsEmpty hasItems={archivedResources.length > 0} onReset={state.reset} emptyTitle="The archive is empty" emptyText="Items you archive rest here, out of the way but never lost." />
      )}
    </div>
  );
}
