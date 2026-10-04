const STYLES = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-amber-light text-amber",
  Urgent: "bg-danger-light text-danger",
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STYLES[priority] || STYLES.Low}`}>
      {priority}
    </span>
  );
}
