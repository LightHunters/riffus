export type SongDTO = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  coverImage: string;
  playCount: number;
  lastPlayed?: string;
  previewUrl?: string;
  source: "local" | "deezer" | "itunes";
};

export type ProviderSong = {
  title: string;
  artist: string;
  album?: string;
  coverImage: string;
  previewUrl?: string;
  source: "deezer" | "itunes";
  deezerId?: number;
  itunesTrackId?: number;
};
