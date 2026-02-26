import { env } from "@/lib/env";

type ITunesTrack = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
};

type ITunesResponse = {
  results?: ITunesTrack[];
};

export async function searchITunes(query: string, limit = 20) {
  const url = new URL("/search", env.ITUNES_API_URL);
  url.searchParams.set("term", query);
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const payload = (await res.json()) as ITunesResponse;
  return (payload.results ?? []).map((track) => ({
    title: track.trackName ?? "Unknown",
    artist: track.artistName ?? "Unknown",
    album: track.collectionName ?? "",
    coverImage: track.artworkUrl100 ?? "",
    previewUrl: track.previewUrl ?? "",
    source: "itunes" as const,
    itunesTrackId: track.trackId,
  }));
}
