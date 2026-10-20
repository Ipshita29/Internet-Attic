import { useUI } from '../../context/UIContext';
import Modal from './Modal';

export default function ConfirmDialog() {
  const { confirmState, settleConfirm } = useUI();
  if (!confirmState) return null;
  const { title, message, confirmLabel = 'Confirm', cancelLabel = 'Keep it', tone } = confirmState;
  return (
    <Modal
      size="sm"
      title={title}
      tone={tone}
      onClose={() => settleConfirm(false)}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => settleConfirm(false)}>{cancelLabel}</button>
          <button type="button" data-autofocus className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}`} onClick={() => settleConfirm(true)}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="confirm-text">{message}</p>
    </Modal>
  );
}
