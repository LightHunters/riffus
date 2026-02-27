import { env } from "@/lib/env";

type DeezerTrack = {
  id: number;
  title: string;
  preview?: string;
  artist?: { name?: string };
  album?: { title?: string; cover_xl?: string; cover_big?: string };
};

type DeezerResponse = {
  data?: DeezerTrack[];
};

export async function searchDeezer(query: string, limit = 20) {
  const url = new URL("/search", env.DEEZER_API_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const payload = (await res.json()) as DeezerResponse;
  return (payload.data ?? []).map((track) => ({
    title: track.title,
    artist: track.artist?.name ?? "Unknown",
    album: track.album?.title ?? "",
    coverImage: track.album?.cover_xl ?? track.album?.cover_big ?? "",
    previewUrl: track.preview ?? "",
    source: "deezer" as const,
    deezerId: track.id,
  }));
}
