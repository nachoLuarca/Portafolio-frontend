export default function SectionHeading({ title, subtitle, action, className = "" }) {
  return (
    <div className={`mb-8 flex items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-[28px] font-bold sm:text-[32px]">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
