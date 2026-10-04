import Modal from "./Modal.jsx";

export default function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-muted mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 text-sm rounded-md border border-border text-ink2 hover:bg-paper">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-md bg-danger text-white hover:opacity-90">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
