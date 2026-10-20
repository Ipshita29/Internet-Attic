import { EmptyIllustration } from './Illustrations';

export default function EmptyState({ kind = 'box', title, children, action }) {
  return (
    <div className="empty-state">
      <EmptyIllustration kind={kind} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
