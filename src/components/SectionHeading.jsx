export default function SectionHeading({ index, title, action, className = "" }) {
  return (
    <div className={`mb-7 flex items-end justify-between gap-4 ${className}`}>
      <h2 className="flex items-baseline gap-2.5 text-[28px]">
        <span className="font-mono text-base text-accent-2">{index}·</span>
        {title}
      </h2>
      {action}
    </div>
  );
}
