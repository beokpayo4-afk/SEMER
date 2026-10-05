import { useEffect } from "react";
import { mediaUrl } from "../utils/media.ts";

type PageDetails = {
  description?: string;
  image?: string;
  documentTitle?: string;
};

function setMeta(attribute: "name" | "property", key: string, content: string | undefined) {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelector(selector);
  if (!content) {
    existing?.remove();
    return;
  }
  const tag = existing ?? document.createElement("meta");
  tag.setAttribute(attribute, key);
  tag.setAttribute("content", content);
  if (!existing) {
    document.head.appendChild(tag);
  }
}

function absoluteUrl(url: string) {
  const resolved = mediaUrl(url);
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  return `${window.location.origin}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}

export function usePageTitle(title: string, details?: PageDetails) {
  const description = details?.description;
  const image = details?.image;
  const documentTitle = details?.documentTitle;

  useEffect(() => {
    const fullTitle = documentTitle ?? `${title} · SEMER`;
    document.title = fullTitle;
    const imageUrl = image ? absoluteUrl(image) : undefined;
    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:url", window.location.href);
    const canonical = document.head.querySelector('link[rel="canonical"]') ?? document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", window.location.href);
    if (!canonical.parentElement) {
      document.head.appendChild(canonical);
    }
  }, [title, description, image, documentTitle]);
}
