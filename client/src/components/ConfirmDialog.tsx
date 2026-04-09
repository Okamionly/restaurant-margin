import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="text-[#525252] dark:text-[#D4D4D4] mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg font-medium border border-[#D4D4D4] dark:border-[#404040] text-[#404040] dark:text-[#D4D4D4] hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </Modal>
  );
}
