import { NavLink } from "react-router-dom";
import { LayoutDashboard, Inbox, Users, ListChecks, Workflow, Settings, X, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/follow-ups", label: "Follow-ups", icon: ListChecks },
  { to: "/automation", label: "Automation", icon: Workflow },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed z-40 lg:z-0 top-0 left-0 h-full w-64 bg-ink text-white flex flex-col
        transition-transform duration-200 lg:translate-x-0 lg:static
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-dashed/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-violet flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="font-display font-700 text-[15px] leading-none">Inquiry Hub</p>
              <p className="text-[10px] text-white/40 mt-1">AI automation, demo mode</p>
            </div>
          </div>
          <button className="lg:hidden text-white/60" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-violet text-white font-medium" : "text-white/70 hover:bg-ink-light hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-ink-dashed/50 text-[11px] text-white/35">
          Demo AI · local data only
        </div>
      </aside>
    </>
  );
}
