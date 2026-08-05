import { cn } from "@/lib/utils";

export default function Container({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1080px] px-4 sm:px-6", className)} {...props}>
      {children}
    </Tag>
  );
}
