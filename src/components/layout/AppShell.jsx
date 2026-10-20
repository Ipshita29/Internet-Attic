import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import ModalHost from './ModalHost';
import IconButton from '../common/IconButton';
import { House } from '../common/Illustrations';
import { useUI } from '../../context/UIContext';

export default function AppShell() {
  const { navOpen, setNavOpen } = useUI();
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setNavOpen(false);
  }, [pathname, setNavOpen]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen, setNavOpen]);

  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="mobile-bar">
        <IconButton label={navOpen ? 'Close menu' : 'Open menu'} aria-expanded={navOpen} aria-controls="sidebar" tip="right" onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </IconButton>
        <span className="mobile-brand"><House size={30} />internet attic</span>
      </header>
      <Sidebar />
      {navOpen && <div className="drawer-scrim" onClick={() => setNavOpen(false)} />}
      <main id="main" className="main" key={pathname + search}>
        <Outlet />
      </main>
      <ModalHost />
    </div>
  );
}
