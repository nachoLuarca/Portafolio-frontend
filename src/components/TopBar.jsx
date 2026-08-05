import ThemeToggle from "./ThemeToggle.jsx";

export default function TopBar() {
  return (
    <div className="sticky top-0 z-10 hidden h-16 items-center justify-end border-b border-border bg-background px-8 md:flex">
      <ThemeToggle />
    </div>
  );
}
