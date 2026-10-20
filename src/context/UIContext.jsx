import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createId } from '../utils/ids';

const UIContext = createContext(null);

/** Shared UI state: toasts, confirm dialog, modals and the mobile drawer. */
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const [itemForm, setItemForm] = useState(null);
  const [roomForm, setRoomForm] = useState(null);
  const [moveItem, setMoveItem] = useState(null);
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const resolver = useRef(null);

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, tone = 'success') => {
      const id = createId('toast');
      setToasts((t) => [...t.slice(-3), { id, message, tone }]);
      window.setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast]
  );

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setConfirmState(options);
      }),
    []
  );

  const settleConfirm = useCallback((answer) => {
    resolver.current?.(answer);
    resolver.current = null;
    setConfirmState(null);
  }, []);

  const value = useMemo(
    () => ({
      toasts, dismissToast, toast, confirm, confirmState, settleConfirm,
      itemForm, roomForm, moveItem, deleteRoom, navOpen, setNavOpen,
      openAddLink: (defaults = {}) => setItemForm({ mode: 'add', defaults }),
      openEditItem: (item) => setItemForm({ mode: 'edit', item }),
      closeItemForm: () => setItemForm(null),
      openRoomForm: (room = null) => setRoomForm({ room }),
      closeRoomForm: () => setRoomForm(null),
      openMove: (item) => setMoveItem(item),
      closeMove: () => setMoveItem(null),
      openDeleteRoom: (room) => setDeleteRoom(room),
      closeDeleteRoom: () => setDeleteRoom(null),
    }),
    [toasts, dismissToast, toast, confirm, confirmState, settleConfirm, itemForm, roomForm, moveItem, deleteRoom, navOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
