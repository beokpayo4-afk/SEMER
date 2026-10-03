export function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3 5h2.2l1.6 9.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L20.2 8H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="19.2" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
