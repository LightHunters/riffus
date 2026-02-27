import { Injectable, ConsoleLogger } from "@nestjs/common";

@Injectable()
export class AppLogger extends ConsoleLogger {
  constructor() {
    super("RiffusBackend");
  }
}
