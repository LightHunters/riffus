export type ProviderSong = {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  previewUrl: string;
  source: "deezer" | "itunes";
  deezerId?: number;
  itunesTrackId?: number;
};
