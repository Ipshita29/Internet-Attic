import { useMemo, useState } from 'react';
import { makeThumbnail } from '../../utils/thumbnail';

/** Consistent crop for every thumbnail; falls back to a generated cover when the image is missing or fails. */
export default function Thumbnail({ item, className = '' }) {
  const [failed, setFailed] = useState(false);
  const fallback = useMemo(() => makeThumbnail(item.domain || item.title, item.domain || item.title), [item.domain, item.title]);
  const src = item.thumbnail && !failed ? item.thumbnail : fallback;
  return (
    <div className={`thumb ${className}`}>
      <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} referrerPolicy="no-referrer" />
    </div>
  );
}
