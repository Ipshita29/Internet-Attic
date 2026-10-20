import { Link } from 'react-router-dom';
import { tagTone } from '../../utils/colors';

export default function TagChip({ tag, to, onRemove, count }) {
  const tone = tagTone(tag);
  const style = { background: tone.bg, color: tone.fg };
  const content = (
    <>
      <span aria-hidden="true">#</span>
      {tag}
      {count !== undefined && <b>{count}</b>}
    </>
  );
  if (onRemove) {
    return (
      <span className="tag-chip" style={style}>
        {content}
        <button type="button" aria-label={`Remove tag ${tag}`} onClick={onRemove}>×</button>
      </span>
    );
  }
  return to ? (
    <Link to={to} className="tag-chip" style={style} onClick={(e) => e.stopPropagation()}>{content}</Link>
  ) : (
    <span className="tag-chip" style={style}>{content}</span>
  );
}
