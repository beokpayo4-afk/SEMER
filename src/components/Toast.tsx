import { useToast } from "../hooks/useToast.ts";

export function Toast() {
  const { toasts, dismissToast } = useToast();
  if (toasts.length === 0) {
    return null;
  }
  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className="rounded-2xl bg-ink px-4 py-3 text-left text-sm text-paper shadow-lg"
        >
          {toast.text}
        </button>
      ))}
    </div>
  );
}
