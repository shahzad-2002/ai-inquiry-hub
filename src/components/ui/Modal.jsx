import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-panel rounded-lg border border-border w-full ${wide ? "max-w-2xl" : "max-w-md"} my-8 shadow-xl`}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <h2 className="font-display font-semibold text-ink2">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink2" aria-label="Close">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
