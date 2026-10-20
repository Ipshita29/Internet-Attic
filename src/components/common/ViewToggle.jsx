import { LayoutGrid, List } from 'lucide-react';
import IconButton from './IconButton';

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Layout">
      <IconButton label="Grid view" className={value === 'grid' ? 'is-active' : ''} aria-pressed={value === 'grid'} onClick={() => onChange('grid')}>
        <LayoutGrid size={18} />
      </IconButton>
      <IconButton label="List view" className={value === 'list' ? 'is-active' : ''} aria-pressed={value === 'list'} onClick={() => onChange('list')}>
        <List size={18} />
      </IconButton>
    </div>
  );
}
