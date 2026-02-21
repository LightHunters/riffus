import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, SongSource } from "@prisma/client";
import { DeezerClient } from "../integrations/deezer.client";
import { ItunesClient } from "../integrations/itunes.client";
import { ProviderSong } from "../integrations/types";
import { PrismaService } from "../prisma/prisma.service";
import { dedupeBySongFields, dedupeProviderSongs } from "./songs.utils";

@Injectable()
export class SongsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly deezerClient: DeezerClient,
    private readonly itunesClient: ItunesClient,
  ) {}

  async getRecent(limit = 10) {
    return this.prisma.song.findMany({
      where: { lastPlayed: { not: null } },
      orderBy: { lastPlayed: "desc" },
      take: limit,
    });
  }

  async getRecommended(limit = 10) {
    return this.prisma.song.findMany({
      orderBy: [{ playCount: "desc" }, { lastPlayed: "desc" }],
      take: limit,
    });
  }

  async search(query: string, limit = 25) {
    const term = query.trim();
    if (!term) return [];

    const localSongs = await this.prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { artist: { contains: term, mode: "insensitive" } },
          { album: { contains: term, mode: "insensitive" } },
        ],
      },
      take: limit,
    });

    const [deezer, itunes] = await Promise.all([
      this.deezerClient.searchTracks(term, limit),
      this.itunesClient.searchTracks(term, limit),
    ]);

    const providerSongs = dedupeProviderSongs([...deezer, ...itunes]).filter(
      (song) => song.title && song.artist && song.coverImage,
    );

    const upsertedSongs = await Promise.all(
      providerSongs.map((song) => this.upsertProviderSong(song)),
    );

    return dedupeBySongFields([...localSongs, ...upsertedSongs]).slice(0, limit);
  }

  async registerPlay(songId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) {
      throw new NotFoundException("Song not found");
    }

    return this.prisma.song.update({
      where: { id: songId },
      data: {
        playCount: { increment: 1 },
        lastPlayed: new Date(),
      },
    });
  }

  private async upsertProviderSong(song: ProviderSong) {
    if (song.deezerId) {
      return this.prisma.song.upsert({
        where: { deezerId: song.deezerId },
        update: {
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverImage: song.coverImage,
          previewUrl: song.previewUrl,
          source: SongSource.deezer,
        },
        create: {
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverImage: song.coverImage,
          previewUrl: song.previewUrl,
          source: SongSource.deezer,
          deezerId: song.deezerId,
        },
      });
    }

    if (song.itunesTrackId) {
      return this.prisma.song.upsert({
        where: { itunesTrackId: song.itunesTrackId },
        update: {
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverImage: song.coverImage,
          previewUrl: song.previewUrl,
          source: SongSource.itunes,
        },
        create: {
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverImage: song.coverImage,
          previewUrl: song.previewUrl,
          source: SongSource.itunes,
          itunesTrackId: song.itunesTrackId,
        },
      });
    }

    const existing = await this.prisma.song.findFirst({
      where: {
        title: song.title,
        artist: song.artist,
        album: song.album,
      },
    });

    if (existing) {
      return this.prisma.song.update({
        where: { id: existing.id },
        data: {
          coverImage: song.coverImage,
          previewUrl: song.previewUrl,
          source:
            song.source === "deezer" ? SongSource.deezer : SongSource.itunes,
        },
      });
    }

    const source = song.source === "deezer" ? SongSource.deezer : SongSource.itunes;

    return this.prisma.song.create({
      data: {
        title: song.title,
        artist: song.artist,
        album: song.album,
        coverImage: song.coverImage,
        previewUrl: song.previewUrl,
        source,
      },
    });
  }
}
