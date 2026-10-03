export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-wine/30 bg-white px-4 py-3 text-sm text-wine" role="alert">
      {message}
    </p>
  );
}
