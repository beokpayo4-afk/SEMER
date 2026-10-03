import { apiBaseUrl } from "../services/api.ts";

export function mediaUrl(url?: string | null) {
  if (!url) {
    return "";
  }
  if (url.startsWith("/uploads/")) {
    return `${apiBaseUrl}${url}`;
  }
  return url;
}
