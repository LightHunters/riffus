const externalApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!externalApiUrl) {
    return normalizedPath;
  }
  return `${externalApiUrl}${normalizedPath}`;
}
