import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../integrations/integrations.module";
import { SongsController } from "./songs.controller";
import { SongsService } from "./songs.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
