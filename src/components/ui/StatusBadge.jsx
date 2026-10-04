const STYLES = {
  Processing: "bg-slate-100 text-slate-700",
  Analyzed: "bg-blue-50 text-blue-700",
  Automated: "bg-emerald-light text-emerald",
  "Analyzed (automation off)": "bg-amber-light text-amber",

  New: "bg-slate-100 text-slate-700",
  Contacted: "bg-blue-50 text-blue-700",
  "Follow-up": "bg-amber-light text-amber",
  Qualified: "bg-violet-light text-violet",
  Converted: "bg-emerald-light text-emerald",
  Closed: "bg-slate-200 text-slate-600",

  Pending: "bg-amber-light text-amber",
  Completed: "bg-emerald-light text-emerald",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STYLES[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
