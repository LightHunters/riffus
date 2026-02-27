import { connectToDatabase } from "@/lib/db";
import { SongModel } from "@/models/Song";
import { ProviderSong } from "@/modules/songs/types";

export async function findRecentSongs(limit: number) {
  await connectToDatabase();
  return SongModel.find({
    lastPlayed: { $exists: true },
  })
    .sort({ lastPlayed: -1 })
    .limit(limit)
    .lean();
}

export async function findRecommendedSongs(limit: number) {
  await connectToDatabase();
  return SongModel.find({})
    .sort({ playCount: -1, lastPlayed: -1 })
    .limit(limit)
    .lean();
}

export async function findLocalSongs(query: string, limit: number) {
  await connectToDatabase();
  return SongModel.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { artist: { $regex: query, $options: "i" } },
      { album: { $regex: query, $options: "i" } },
    ],
  })
    .limit(limit)
    .lean();
}

export async function findSongById(songId: string) {
  await connectToDatabase();
  return SongModel.findById(songId);
}

export async function incrementPlay(songId: string) {
  await connectToDatabase();
  return SongModel.findByIdAndUpdate(
    songId,
    {
      $inc: { playCount: 1 },
      $set: { lastPlayed: new Date() },
    },
    { new: true },
  ).lean();
}

export async function upsertProviderSongs(songs: ProviderSong[]) {
  await connectToDatabase();
  const writes = songs.map((song) => {
    const filter = song.deezerId
      ? { deezerId: song.deezerId }
      : song.itunesTrackId
        ? { itunesTrackId: song.itunesTrackId }
        : {
            title: song.title,
            artist: song.artist,
            album: song.album ?? "",
          };

    return SongModel.findOneAndUpdate(
      filter,
      {
        $set: {
          title: song.title,
          artist: song.artist,
          album: song.album ?? "",
          coverImage: song.coverImage,
          previewUrl: song.previewUrl ?? "",
          source: song.source,
          ...(song.deezerId ? { deezerId: song.deezerId } : {}),
          ...(song.itunesTrackId ? { itunesTrackId: song.itunesTrackId } : {}),
        },
        $setOnInsert: { playCount: 0 },
      },
      {
        upsert: true,
        new: true,
      },
    ).lean();
  });

  return Promise.all(writes);
}
