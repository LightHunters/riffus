import { searchDeezer } from "@/lib/providers/deezer";
import { searchITunes } from "@/lib/providers/itunes";
import { toSongDTO } from "@/modules/songs/mappers";
import {
  findLocalSongs,
  findRecommendedSongs,
  findRecentSongs,
  incrementPlay,
  upsertProviderSongs,
} from "@/modules/songs/repository";
import { ProviderSong, SongDTO } from "@/modules/songs/types";

function dedupeProviderSongs(songs: ProviderSong[]): ProviderSong[] {
  const map = new Map<string, ProviderSong>();
  for (const song of songs) {
    const key = song.deezerId
      ? `deezer_${song.deezerId}`
      : song.itunesTrackId
        ? `itunes_${song.itunesTrackId}`
        : `${song.title.toLowerCase()}_${song.artist.toLowerCase()}_${(song.album ?? "").toLowerCase()}`;

    if (!map.has(key)) {
      map.set(key, song);
    }
  }
  return Array.from(map.values());
}

function dedupeMergedSongs(songs: SongDTO[]): SongDTO[] {
  const map = new Map<string, SongDTO>();
  for (const song of songs) {
    const key = `${song.title.toLowerCase()}_${song.artist.toLowerCase()}_${(song.album ?? "").toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, song);
    }
  }
  return Array.from(map.values());
}

export async function getRecentSongs(limit: number): Promise<SongDTO[]> {
  try {
    const songs = await findRecentSongs(limit);
    return songs.map(toSongDTO);
  } catch {
    return [];
  }
}

export async function getRecommendedSongs(limit: number): Promise<SongDTO[]> {
  try {
    const songs = await findRecommendedSongs(limit);
    return songs.map(toSongDTO);
  } catch {
    return [];
  }
}

export async function searchSongs(query: string, limit: number): Promise<SongDTO[]> {
  const normalized = query.trim();
  if (!normalized) return [];

  let localDtos: SongDTO[] = [];
  try {
    const local = await findLocalSongs(normalized, limit);
    localDtos = local.map(toSongDTO);
  } catch {
    localDtos = [];
  }

  const [deezer, itunes] = await Promise.all([
    searchDeezer(normalized, limit).catch(() => []),
    searchITunes(normalized, limit).catch(() => []),
  ]);

  const providerSongs = dedupeProviderSongs([...deezer, ...itunes]).filter(
    (song) => song.title && song.artist && song.coverImage,
  );

  let providerDtos: SongDTO[] = [];
  if (providerSongs.length > 0) {
    try {
      const upserted = await upsertProviderSongs(providerSongs);
      providerDtos = upserted.map(toSongDTO);
    } catch {
      providerDtos = providerSongs.map((song, index) => ({
        _id: `external-${song.source}-${song.deezerId ?? song.itunesTrackId ?? index}`,
        title: song.title,
        artist: song.artist,
        album: song.album ?? "",
        coverImage: song.coverImage,
        playCount: 0,
        previewUrl: song.previewUrl ?? "",
        source: song.source,
      }));
    }
  }

  const merged = dedupeMergedSongs([...localDtos, ...providerDtos]);
  return merged.slice(0, limit);
}

export async function registerSongPlay(songId: string): Promise<SongDTO | null> {
  try {
    const updated = await incrementPlay(songId);
    if (!updated) return null;
    return toSongDTO(updated);
  } catch {
    return null;
  }
}
