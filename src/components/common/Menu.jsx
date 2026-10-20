import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';
import IconButton from './IconButton';

/** Three-dot actions menu rendered in a portal so cards never clip it. */
export default function Menu({ items, label = 'More actions' }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const trigger = useRef(null);
  const panel = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const r = trigger.current.getBoundingClientRect();
    const width = 220;
    const height = panel.current?.offsetHeight || items.length * 40;
    const left = Math.min(Math.max(8, r.right - width), window.innerWidth - width - 8);
    const top = r.bottom + height + 12 > window.innerHeight ? Math.max(8, r.top - height - 6) : r.bottom + 6;
    setPos({ top, left });
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!panel.current?.contains(e.target) && !trigger.current?.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
        trigger.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    panel.current?.querySelector('button')?.focus();
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, close]);

  const onPanelKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const btns = [...panel.current.querySelectorAll('button')];
    const i = btns.indexOf(document.activeElement);
    btns[(i + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length]?.focus();
  };

  return (
    <>
      <IconButton
        ref={trigger}
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="menu-trigger"
        tip="left"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <MoreHorizontal size={18} />
      </IconButton>
      {open &&
        createPortal(
          <div ref={panel} className="menu" role="menu" style={{ top: pos.top, left: pos.left }} onKeyDown={onPanelKey}>
            {items.filter(Boolean).map((item, i) =>
              item.divider ? (
                <hr key={`d${i}`} />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={item.danger ? 'is-danger' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    close();
                    item.onClick();
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            )}
          </div>,
          document.body
        )}
    </>
  );
}
