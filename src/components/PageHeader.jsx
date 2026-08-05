import { cn } from "@/lib/utils";

export default function PageHeader({ title, description, action, className }) {
  return (
    <div className={cn("mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h1 className="text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
