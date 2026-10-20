import { useUI } from '../../context/UIContext';
import ResourceFormModal from '../resources/ResourceFormModal';
import MoveModal from '../resources/MoveModal';
import RoomFormModal from '../rooms/RoomFormModal';
import DeleteRoomModal from '../rooms/DeleteRoomModal';
import ConfirmDialog from '../common/ConfirmDialog';
import Toasts from '../common/Toasts';

/** Renders every global modal so any page can open them through useUI(). */
export default function ModalHost() {
  const ui = useUI();
  return (
    <>
      {ui.itemForm && (
        <ResourceFormModal
          key={`${ui.itemForm.mode}-${ui.itemForm.item?.id || 'new'}`}
          mode={ui.itemForm.mode}
          item={ui.itemForm.item}
          defaults={ui.itemForm.defaults}
          onClose={ui.closeItemForm}
        />
      )}
      {ui.roomForm && <RoomFormModal room={ui.roomForm.room} onClose={ui.closeRoomForm} />}
      {ui.moveItem && <MoveModal item={ui.moveItem} onClose={ui.closeMove} />}
      {ui.deleteRoom && <DeleteRoomModal room={ui.deleteRoom} onClose={ui.closeDeleteRoom} />}
      <ConfirmDialog />
      <Toasts />
    </>
  );
}
