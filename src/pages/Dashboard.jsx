import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import * as store from "../services/storageService.js";
import { CATEGORIES, PRIORITIES } from "../services/aiService.js";

const PIE_COLORS = ["#94A3B8", "#3B82F6", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const inquiries = store.getInquiries();
  const leads = store.getLeads();
  const tasks = store.getTasks();
  const history = store.getAutomationHistory();

  const stats = useMemo(() => {
    const newLeads = leads.filter((l) => l.status === "New").length;
    const highPriorityLeads = leads.filter((l) => l.priority === "High" || l.priority === "Urgent").length;
    const pendingFollowUps = tasks.filter((t) => t.status === "Pending").length;
    const completedAutomations = history.filter((h) => h.type === "automation_completed").length;
    return { total: inquiries.length, newLeads, highPriorityLeads, pendingFollowUps, completedAutomations };
  }, [inquiries, leads, tasks, history]);

  const priorityData = PRIORITIES.map((p) => ({ name: p, value: leads.filter((l) => l.priority === p).length })).filter((d) => d.value > 0);
  const categoryData = CATEGORIES.map((c) => ({ category: c, count: inquiries.filter((i) => i.category === c).length })).filter((d) => d.count > 0);

  const recentInquiries = [...inquiries].slice(-5).reverse();
  const recentActivity = history.slice(0, 6);

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Inquiries" value={stats.total} />
        <StatCard label="New Leads" value={stats.newLeads} />
        <StatCard label="High Priority Leads" value={stats.highPriorityLeads} accent="danger" />
        <StatCard label="Pending Follow-ups" value={stats.pendingFollowUps} accent="amber" />
        <StatCard label="Completed Automations" value={stats.completedAutomations} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Category Breakdown</h3>
          <div className="h-56">
            {categoryData.length === 0 ? (
              <p className="text-sm text-muted italic">No inquiries yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E3F0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6D5BD0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Priority Breakdown</h3>
          <div className="h-56">
            {priorityData.length === 0 ? (
              <p className="text-sm text-muted italic">No leads yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={75} label>
                    {priorityData.map((d) => (
                      <Cell key={d.name} fill={PIE_COLORS[PRIORITIES.indexOf(d.name)]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Recent Inquiries</h3>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted italic">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((i) => (
                <Link key={i.id} to={`/inquiries/${i.id}`} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-ink2 truncate">{i.clientName}</p>
                    <p className="text-xs text-muted truncate">{i.category || "Pending analysis"}</p>
                  </div>
                  {i.priority && <PriorityBadge priority={i.priority} />}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Recent Automation Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted italic">No automation activity yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((h) => (
                <div key={h.id} className="text-sm">
                  <p className="text-ink2">{h.description}</p>
                  <p className="text-xs text-muted">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, accent = "violet" }) {
  const borderClass = { violet: "border-t-violet", danger: "border-t-danger", amber: "border-t-amber", emerald: "border-t-emerald" }[accent];
  return (
    <div className={`bg-panel border border-border rounded-lg p-4 border-t-2 ${borderClass}`}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-ink2">{value}</p>
    </div>
  );
}
