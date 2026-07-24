export function resolveAssetUrl(
  path?: string | null,
  baseUrl?: string | null,
) {
  const normalizedPath = path?.trim();
  if (!normalizedPath) return undefined;

  if (/^(https?:)?\/\//i.test(normalizedPath) || normalizedPath.startsWith("data:")) {
    return normalizedPath;
  }

  const normalizedBaseUrl = baseUrl?.trim().replace(/\/+$/, "");
  if (!normalizedBaseUrl) return normalizedPath;

  return `${normalizedBaseUrl}/${normalizedPath.replace(/^\/+/, "")}`;
}
