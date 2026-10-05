export function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path
        d="M8.5 4.5h2.2l1.2 3-1.6 1.2a12 12 0 0 0 5 5l1.2-1.6 3 1.2v2.2c0 .8-.6 1.5-1.4 1.6A14 14 0 0 1 6.9 5.9c.1-.8.8-1.4 1.6-1.4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
