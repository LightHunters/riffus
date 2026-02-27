import { ProviderSong } from "../integrations/types";

export function dedupeProviderSongs(songs: ProviderSong[]): ProviderSong[] {
  const map = new Map<string, ProviderSong>();
  for (const song of songs) {
    const key = song.deezerId
      ? `deezer_${song.deezerId}`
      : song.itunesTrackId
        ? `itunes_${song.itunesTrackId}`
        : `${song.title.toLowerCase()}_${song.artist.toLowerCase()}_${song.album.toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, song);
    }
  }
  return Array.from(map.values());
}

export function dedupeBySongFields<T extends { title: string; artist: string; album?: string }>(
  songs: T[],
): T[] {
  const map = new Map<string, T>();
  for (const song of songs) {
    const key = `${song.title.toLowerCase()}_${song.artist.toLowerCase()}_${(song.album ?? "").toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, song);
    }
  }
  return Array.from(map.values());
}
