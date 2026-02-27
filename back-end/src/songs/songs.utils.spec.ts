import { dedupeBySongFields, dedupeProviderSongs } from "./songs.utils";

describe("songs.utils", () => {
  it("dedupes provider songs by provider id", () => {
    const result = dedupeProviderSongs([
      {
        title: "A",
        artist: "X",
        album: "R",
        coverImage: "c",
        previewUrl: "p",
        source: "deezer",
        deezerId: 10,
      },
      {
        title: "A2",
        artist: "X2",
        album: "R2",
        coverImage: "c2",
        previewUrl: "p2",
        source: "deezer",
        deezerId: 10,
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].deezerId).toBe(10);
  });

  it("dedupes songs by title/artist/album", () => {
    const result = dedupeBySongFields([
      { title: "One", artist: "U2", album: "Best" },
      { title: "ONE", artist: "u2", album: "BEST" },
    ]);
    expect(result).toHaveLength(1);
  });
});
