import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProviderSong } from "./types";

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

@Injectable()
export class ItunesClient {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async searchTracks(query: string, limit = 25): Promise<ProviderSong[]> {
    const baseUrl =
      this.config.get<string>("ITUNES_API_URL") ?? "https://itunes.apple.com";

    try {
      const response = await firstValueFrom(
        this.http.get<ITunesResponse>(`${baseUrl}/search`, {
          params: {
            term: query,
            entity: "song",
            limit,
          },
          timeout: 7000,
        }),
      );

      return (response.data.results ?? []).map((track) => ({
        title: track.trackName ?? "Unknown",
        artist: track.artistName ?? "Unknown",
        album: track.collectionName ?? "",
        coverImage: track.artworkUrl100 ?? "",
        previewUrl: track.previewUrl ?? "",
        source: "itunes",
        itunesTrackId: track.trackId,
      }));
    } catch {
      return [];
    }
  }
}
