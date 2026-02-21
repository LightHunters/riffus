import { IsIn } from "class-validator";

export class UpdateOrderStatusDto {
  @IsIn(["queued", "playing", "completed"])
  status!: "queued" | "playing" | "completed";
}
