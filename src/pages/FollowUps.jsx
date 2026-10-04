import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import * as store from "../services/storageService.js";

export default function FollowUps() {
  const [tasks, setTasks] = useState(() => store.getTasks());
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return statusFilter === "All" ? sorted : sorted.filter((t) => t.status === statusFilter);
  }, [tasks, statusFilter]);

  function markCompleted(task) {
    const next = store.updateTask(task.id, { status: "Completed" });
    setTasks(next);
    store.saveAutomationEvent({
      type: "followup_completed",
      description: `Follow-up completed: ${task.name}`,
      taskId: task.id,
      inquiryId: task.inquiryId,
    });
  }

  return (
    <DashboardLayout title="Follow-ups">
      <div className="flex gap-3 mb-5">
        <select className="input sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={tasks.length === 0 ? "No follow-up tasks yet" : "No tasks match this filter"} />
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-panel border border-border rounded-lg p-4">
              <div className="min-w-0">
                <Link to={`/inquiries/${t.inquiryId}`} className="text-sm font-medium text-ink2 hover:text-violet truncate block">{t.name}</Link>
                <p className="text-xs text-muted mt-0.5">Client: {t.client} · Due {t.dueDate}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
                {t.status !== "Completed" && (
                  <button onClick={() => markCompleted(t)} className="flex items-center gap-1 text-xs font-medium text-emerald border border-emerald/30 hover:bg-emerald-light px-2.5 py-1.5 rounded-md">
                    <CheckCircle2 size={14} /> Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
