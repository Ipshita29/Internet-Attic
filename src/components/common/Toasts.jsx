import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function Toasts() {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          {t.tone === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{t.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(t.id)}><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
