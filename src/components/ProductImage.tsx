import { useState } from "react";
import { mediaUrl } from "../utils/media.ts";

export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-sand text-xs tracking-[0.2em] text-muted uppercase ${className}`}>
        SEMER
      </div>
    );
  }
  return (
    <img
      src={mediaUrl(src)}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
