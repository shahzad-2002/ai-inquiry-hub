import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, Trash2, Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import * as store from "../services/storageService.js";
import { CATEGORIES, PRIORITIES } from "../services/aiService.js";

export default function Inquiries() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState(() => store.getInquiries());
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...inquiries].reverse().filter((i) => {
      const matchesSearch =
        !q ||
        i.clientName?.toLowerCase().includes(q) ||
        i.message?.toLowerCase().includes(q) ||
        i.service?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q);
      const matchesPriority = priorityFilter === "All" || i.priority === priorityFilter;
      const matchesCategory = categoryFilter === "All" || i.category === categoryFilter;
      return matchesSearch && matchesPriority && matchesCategory;
    });
  }, [inquiries, search, priorityFilter, categoryFilter]);

  function handleDelete() {
    const next = store.deleteInquiry(deleteTarget.id);
    setInquiries(next);
    setDeleteTarget(null);
  }

  return (
    <DashboardLayout title="Inquiry Inbox">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-64">
            <Search size={16} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, message, service…"
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
            />
          </div>
          <select className="input sm:w-40" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option>All</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="input sm:w-48" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button
          onClick={() => navigate("/inquiries/new")}
          className="flex items-center justify-center gap-1.5 bg-violet hover:bg-violet-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          <Plus size={16} /> New Inquiry
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={inquiries.length === 0 ? "No inquiries yet" : "No inquiries match your filters"}
          description={inquiries.length === 0 ? "Create your first inquiry to see AI automation in action." : undefined}
          action={
            inquiries.length === 0 && (
              <Link to="/inquiries/new" className="text-sm text-violet font-medium hover:underline">
                + New Inquiry
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink2">{i.clientName}</td>
                  <td className="px-4 py-3 text-muted max-w-xs truncate">{i.message}</td>
                  <td className="px-4 py-3 text-muted">{i.category || "—"}</td>
                  <td className="px-4 py-3">{i.priority ? <PriorityBadge priority={i.priority} /> : "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => navigate(`/inquiries/${i.id}`)} className="p-1.5 rounded hover:bg-paper text-ink2/70" aria-label="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(i)} className="p-1.5 rounded hover:bg-red-50 text-danger" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete inquiry?"
        message={`This will permanently remove the inquiry from ${deleteTarget?.clientName}.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}
