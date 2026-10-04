import { useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";

export default function Topbar({ onMenuClick, title }) {
  const navigate = useNavigate();
  return (
    <header className="h-16 border-b border-border bg-panel flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-ink2/70" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="font-display font-semibold text-lg text-ink2">{title}</h1>
      </div>
      <button
        onClick={() => navigate("/inquiries/new")}
        className="flex items-center gap-1.5 bg-violet hover:bg-violet-dark text-white text-sm font-medium px-3.5 py-2 rounded-md"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">New Inquiry</span>
      </button>
    </header>
  );
}
