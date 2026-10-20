import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotFound({ title = 'Lost in the attic', text = "We looked behind the boxes and under the rug, but that page isn't here.", backTo = '/', backLabel = 'Back home' }) {
  return (
    <div className="page">
      <EmptyState kind="search" title={title} action={<Link to={backTo} className="btn btn-primary">{backLabel}</Link>}>{text}</EmptyState>
    </div>
  );
}
