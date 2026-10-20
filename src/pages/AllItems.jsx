import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import ResourceToolbar from '../components/resources/ResourceToolbar';
import ResourceCollection from '../components/resources/ResourceCollection';
import ResultsEmpty from '../components/common/ResultsEmpty';
import { useApp } from '../context/AppContext';
import { useUI } from '../context/UIContext';
import { useResourceFilters } from '../hooks/useResourceFilters';

export default function AllItems() {
  const { activeResources, view } = useApp();
  const { openAddLink } = useUI();
  const [params] = useSearchParams();
  const state = useResourceFilters(activeResources, {
    tag: params.get('tag') || 'all',
    room: params.get('room') || 'all',
    query: params.get('q') || '',
  });

  return (
    <div className="page">
      <PageHeader
        eyebrow="Everything you've kept"
        title="All Items"
        subtitle={`${activeResources.length} ${activeResources.length === 1 ? 'treasure' : 'treasures'} in your attic.`}
        actions={<button type="button" className="btn btn-primary" onClick={() => openAddLink()}><Plus size={18} />Add a link</button>}
      />
      <ResourceToolbar state={state} items={activeResources} />
      <p className="result-count" aria-live="polite">Showing {state.results.length} of {activeResources.length}</p>
      {state.results.length ? (
        <ResourceCollection items={state.results} view={view} />
      ) : (
        <ResultsEmpty hasItems={activeResources.length > 0} onReset={state.reset} onAdd={() => openAddLink()} emptyTitle="Your attic is empty" />
      )}
    </div>
  );
}
