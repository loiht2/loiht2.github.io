export default function NewsList({ items }) {
  if (!items.length) return null;
  return (
    <ul className="dim-list space-y-3">
      {items.map((n, i) => (
        <li key={`${n.date}-${i}`} className="flex gap-4">
          <span className="w-20 shrink-0 pt-0.5 font-mono text-xs text-muted">{n.date}</span>
          <span className="text-sm">{n.text}</span>
        </li>
      ))}
    </ul>
  );
}
