import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { SongLimitQueryDto, SongSearchQueryDto } from "./dto/song-query.dto";
import { SongsService } from "./songs.service";

@Controller("api/songs")
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get("recent")
  async recent(@Query() query: SongLimitQueryDto) {
    return this.songsService.getRecent(query.limit ?? 10);
  }

  @Get("recommended")
  async recommended(@Query() query: SongLimitQueryDto) {
    return this.songsService.getRecommended(query.limit ?? 10);
  }

  @Get("search")
  async search(@Query() query: SongSearchQueryDto) {
    return this.songsService.search(query.q, query.limit ?? 25);
  }

  @Post(":id/play")
  async play(@Param("id") id: string) {
    return this.songsService.registerPlay(id);
  }
}
