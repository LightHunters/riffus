import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { ProviderSong } from "./types";

type DeezerTrack = {
  id: number;
  title: string;
  preview?: string;
  artist?: { name?: string };
  album?: { title?: string; cover_xl?: string; cover_big?: string };
};

type DeezerSearchResponse = {
  data?: DeezerTrack[];
};

@Injectable()
export class DeezerClient {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async searchTracks(query: string, limit = 25): Promise<ProviderSong[]> {
    const baseUrl =
      this.config.get<string>("DEEZER_API_URL") ?? "https://api.deezer.com";

    try {
      const response = await firstValueFrom(
        this.http.get<DeezerSearchResponse>(`${baseUrl}/search`, {
          params: { q: query, limit },
          timeout: 7000,
        }),
      );

      return (response.data.data ?? []).map((track) => ({
        title: track.title,
        artist: track.artist?.name ?? "Unknown",
        album: track.album?.title ?? "",
        coverImage: track.album?.cover_xl ?? track.album?.cover_big ?? "",
        previewUrl: track.preview ?? "",
        source: "deezer",
        deezerId: track.id,
      }));
    } catch {
      return [];
    }
  }
}
