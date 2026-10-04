export default function EmptyState({ title, description, action }) {
  return (
    <div className="bg-panel border border-dashed border-border rounded-lg p-10 text-center">
      <p className="font-display text-ink2 text-base mb-1">{title}</p>
      {description && <p className="text-sm text-muted mb-4">{description}</p>}
      {action}
    </div>
  );
}
