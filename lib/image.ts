import { API_BASE_URL } from "./config";

// Resolve an image URL coming from the API into an absolute, loadable URL.
export function getImageUrl(
  fotoUrl?: string | null,
  foto?: string | null,
  fallback = ""
): string {
  let value = fotoUrl || foto;
  if (!value) return fallback;
  // Upgrade insecure http URLs to https to avoid mixed-content blocking.
  if (value.startsWith("http://")) value = "https://" + value.slice("http://".length);
  if (value.startsWith("https://")) {
    // If backend returned a localhost URL, rebase to the real API origin.
    if (value.includes("localhost") || value.includes("127.0.0.1")) {
      try {
        const origin = new URL(API_BASE_URL).origin;
        const path = value.substring(value.indexOf("/", value.indexOf("//") + 2));
        return `${origin}${path}`;
      } catch {
        return value;
      }
    }
    return value;
  }
  const origin = (() => {
    try {
      return new URL(API_BASE_URL).origin;
    } catch {
      return API_BASE_URL;
    }
  })();
  return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
}
