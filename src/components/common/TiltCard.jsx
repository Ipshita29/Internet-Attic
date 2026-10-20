import { useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Wraps children in a card that tilts toward the pointer in 3D. Layers inside can use translateZ. */
export default function TiltCard({ as: Tag = 'div', className = '', max = 7, children, style, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const onMove = (e) => {
    if (reduced || e.pointerType === 'touch' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`);
    ref.current.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`);
    ref.current.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(0)}%`);
    ref.current.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(0)}%`);
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--ry', '0deg');
    ref.current.style.setProperty('--rx', '0deg');
  };

  return (
    <Tag ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} style={style} {...rest}>
      {children}
    </Tag>
  );
}
