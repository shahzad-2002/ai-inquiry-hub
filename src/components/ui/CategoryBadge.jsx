export default function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-violet-light text-violet-dark">
      {category}
    </span>
  );
}
