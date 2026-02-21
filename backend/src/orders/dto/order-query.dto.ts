import { IsIn, IsOptional } from "class-validator";

export class OrderQueryDto {
  @IsOptional()
  @IsIn(["queued", "playing", "completed"])
  status?: "queued" | "playing" | "completed";
}
