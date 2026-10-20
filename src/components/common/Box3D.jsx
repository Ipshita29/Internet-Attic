import { useEffect, useState } from 'react';

/**
 * A CSS 3D treasure chest built from real cuboid faces.
 * The lid hinges on the back edge and the treasure glows when it opens.
 */
export default function Box3D({ open: openProp, autoOpen = false, size = 'md', spin = true, label = 'Treasure chest' }) {
  const [hoverOpen, setHoverOpen] = useState(false);
  const [autoState, setAutoState] = useState(false);

  useEffect(() => {
    if (!autoOpen) return undefined;
    const t = window.setTimeout(() => setAutoState(true), 450);
    return () => window.clearTimeout(t);
  }, [autoOpen]);

  const isOpen = openProp ?? (autoOpen ? autoState : hoverOpen);

  return (
    <div
      className={`box3d box3d-${size} ${isOpen ? 'is-open' : ''} ${spin ? 'is-spinning' : ''}`}
      role="img"
      aria-label={label}
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      <div className="box3d-shadow" />
      <div className="box3d-model">
        <div className="box3d-base">
          <div className="box3d-face f-front"><span className="box3d-lock" /></div>
          <div className="box3d-face f-back" />
          <div className="box3d-face f-left" />
          <div className="box3d-face f-right" />
          <div className="box3d-face f-bottom" />
          <div className="box3d-face f-treasure" />
        </div>
        <div className="box3d-lid">
          <div className="box3d-face l-front" />
          <div className="box3d-face l-back" />
          <div className="box3d-face l-left" />
          <div className="box3d-face l-right" />
          <div className="box3d-face l-top" />
        </div>
        <div className="box3d-gems" aria-hidden="true">
          <i className="gem g1" /><i className="gem g2" /><i className="gem g3" /><i className="gem g4" />
        </div>
      </div>
    </div>
  );
}
