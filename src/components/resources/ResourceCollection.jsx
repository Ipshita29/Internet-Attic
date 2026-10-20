import ResourceCard from './ResourceCard';
import ResourceRow from './ResourceRow';

export default function ResourceCollection({ items, view, extraMenu }) {
  if (view === 'list') {
    return (
      <div className="resource-list">
        {items.map((item) => <ResourceRow key={item.id} item={item} extraMenu={extraMenu} />)}
      </div>
    );
  }
  return (
    <div className="resource-grid">
      {items.map((item, i) => <ResourceCard key={item.id} item={item} index={i} extraMenu={extraMenu} />)}
    </div>
  );
}
