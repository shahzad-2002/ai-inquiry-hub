import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import * as store from "../services/storageService.js";

const LEAD_STATUSES = ["New", "Contacted", "Follow-up", "Qualified", "Converted", "Closed"];

export default function Leads() {
  const [leads, setLeads] = useState(() => store.getLeads());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...leads].reverse().filter((l) => {
      const matchesSearch = !q || l.client.toLowerCase().includes(q) || l.service?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  function changeStatus(id, status) {
    const next = store.updateLead(id, { status });
    setLeads(next);
  }
  function handleDelete() {
    const next = store.deleteLead(deleteTarget.id);
    setLeads(next);
    setDeleteTarget(null);
  }

  return (
    <DashboardLayout title="Leads">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-64">
          <Search size={16} className="text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client or service…" className="bg-transparent text-sm outline-none w-full placeholder:text-muted" />
        </div>
        <select className="input sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={leads.length === 0 ? "No leads created yet" : "No leads match your filters"} />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink2">
                    <Link to={`/inquiries/${l.inquiryId}`} className="hover:text-violet">{l.client}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.service}</td>
                  <td className="px-4 py-3 text-muted">{l.category}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={l.priority} /></td>
                  <td className="px-4 py-3">
                    <select value={l.status} onChange={(e) => changeStatus(l.id, e.target.value)} className="input py-1.5 text-xs w-auto">
                      {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">{l.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(l)} className="p-1.5 rounded hover:bg-red-50 text-danger" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete lead?" message={`Remove the lead for ${deleteTarget?.client}?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </DashboardLayout>
  );
}
