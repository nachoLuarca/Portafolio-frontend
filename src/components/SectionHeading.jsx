export default function SectionHeading({ title, action, className = "" }) {
  return (
    <div className={`mb-5 flex items-end justify-between gap-4 border-t border-border pt-4 ${className}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {action}
    </div>
  );
}
