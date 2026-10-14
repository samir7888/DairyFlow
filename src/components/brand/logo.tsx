import { cn } from "@/lib/utils";

/** Same mark as the favicon: milk drop over a ledger line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9", className)} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1B2F4B" />
      <path
        fill="#fff"
        d="M32 5.07 L38.47 23.13 A11.52 11.52 0 1 1 25.53 23.13 Z"
      />
      <rect x="18.56" y="49.92" width="26.88" height="4.48" rx="2.24" fill="#E8A800" />
    </svg>
  );
}
