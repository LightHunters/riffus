import { IsIn, IsOptional } from "class-validator";

export class DemoUserQueryDto {
  @IsOptional()
  @IsIn(["customer", "owner"])
  role?: "customer" | "owner";
}
