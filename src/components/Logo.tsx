import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          <linearGradient id="ov-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0" stopColor="oklch(0.74 0.17 55)" />
            <stop offset="1" stopColor="oklch(0.6 0.23 30)" />
          </linearGradient>
        </defs>
        <path
          d="M14 8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V18"
          stroke="url(#ov-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="24" cy="26" rx="9" ry="5.5" stroke="url(#ov-grad)" strokeWidth="2.4" fill="none" />
        <circle cx="24" cy="26" r="2.6" fill="url(#ov-grad)" />
      </svg>
      <span className="font-display text-lg font-extrabold tracking-tight">
        <span className="text-gradient-brand">OPEN</span>{" "}
        <span className="text-foreground">VISION</span>
      </span>
    </span>
  );
}