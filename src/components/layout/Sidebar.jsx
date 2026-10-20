import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Archive, DoorOpen, Hourglass, House as HomeIcon, Library, Plus, RotateCcw, Tags } from 'lucide-react';
import { House, CatOnBooks, Ornament, Plant } from '../common/Illustrations';
import { useUI } from '../../context/UIContext';
import { useApp } from '../../context/AppContext';
import { normalizeUrl } from '../../utils/url';
import { isQueued } from '../../utils/resources';

const NAV = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/items', label: 'All Items', icon: Library },
  { to: '/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/revisit', label: 'Revisit Queue', icon: Hourglass, badge: true },
  { to: '/tags', label: 'Tags', icon: Tags },
  { to: '/archive', label: 'Archive', icon: Archive },
];

export default function Sidebar() {
  const { openAddLink, setNavOpen, navOpen, confirm, toast } = useUI();
  const { resources, resetAll } = useApp();
  const [url, setUrl] = useState('');
  const [hint, setHint] = useState('');
  const queued = resources.filter((r) => isQueued(r)).length;

  const quickSave = (e) => {
    e.preventDefault();
    if (url.trim() && !normalizeUrl(url)) {
      setHint('Use an http:// or https:// link');
      return;
    }
    setHint('');
    openAddLink({ url: url.trim() ? normalizeUrl(url) : '' });
    setUrl('');
    setNavOpen(false);
  };

  return (
    <aside id="sidebar" className={`sidebar ${navOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <NavLink to="/" className="brand" onClick={() => setNavOpen(false)}>
        <House size={46} />
        <div>
          <span className="brand-name">internet attic</span>
          <span className="brand-sub">good ideas live here</span>
        </div>
      </NavLink>

      <nav className="nav">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} className="nav-link" onClick={() => setNavOpen(false)}>
            <Icon size={19} aria-hidden="true" />
            <span>{label}</span>
            {badge && queued > 0 && <b className="nav-badge" aria-label={`${queued} waiting`}>{queued}</b>}
          </NavLink>
        ))}
      </nav>

      <form className="quick-save" onSubmit={quickSave} noValidate>
        <label htmlFor="quick-url">Quick Save</label>
        <div className="quick-save-row">
          <input id="quick-url" type="text" inputMode="url" value={url} placeholder="Paste a link..." onChange={(e) => { setUrl(e.target.value); setHint(''); }} autoComplete="off" />
          <button type="submit" className="icon-btn icon-btn-solid" aria-label="Add link" data-tip="Add link" data-tip-pos="top"><Plus size={18} /></button>
        </div>
        {hint && <small className="field-error" role="alert">{hint}</small>}
      </form>

      <div className="sidebar-art" aria-hidden="true">
        <div className="sidebar-plant"><Ornament box="-30 -64 60 90" width={60} height={90}><Plant s={0.8} /></Ornament></div>
        <CatOnBooks width={170} />
      </div>
      <button
        type="button"
        className="reset-link"
        onClick={async () => {
          const ok = await confirm({
            title: 'Erase all data?',
            message: 'This deletes every saved link and custom room, leaving a fresh empty attic. This cannot be undone.',
            confirmLabel: 'Erase everything',
            tone: 'danger',
          });
          if (ok) {
            resetAll();
            setNavOpen(false);
            toast('Fresh attic ready');
          }
        }}
      >
        <RotateCcw size={13} />Erase all data
      </button>
    </aside>
  );
}
