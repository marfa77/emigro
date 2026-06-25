/** Compass mark — brand icon for Emigro */
export function EmigroMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-corridor-600" />
      <circle cx="20" cy="20" r="11" stroke="white" strokeOpacity="0.35" strokeWidth="1.25" />
      <path
        d="M20 9 L23.5 26 L20 22 L16.5 26 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M20 31 L16.5 14 L20 18 L23.5 14 Z"
        fill="white"
        fillOpacity="0.45"
      />
      <circle cx="20" cy="20" r="2.25" fill="white" />
    </svg>
  );
}
