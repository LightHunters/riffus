import { SongDocument } from "@/models/Song";
import { SongDTO } from "@/modules/songs/types";

type MaybeSong = Partial<SongDocument> & { _id?: unknown };

export function toSongDTO(song: MaybeSong): SongDTO {
  return {
    _id: String(song._id ?? ""),
    title: song.title ?? "",
    artist: song.artist ?? "",
    album: song.album ?? "",
    coverImage: song.coverImage ?? "",
    playCount: song.playCount ?? 0,
    lastPlayed: song.lastPlayed ? new Date(song.lastPlayed).toISOString() : undefined,
    previewUrl: song.previewUrl ?? "",
    source: (song.source as SongDTO["source"]) ?? "local",
  };
}
