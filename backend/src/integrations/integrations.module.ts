import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DeezerClient } from "./deezer.client";
import { ItunesClient } from "./itunes.client";

@Module({
  imports: [HttpModule],
  providers: [DeezerClient, ItunesClient],
  exports: [DeezerClient, ItunesClient],
})
export class IntegrationsModule {}
