import { IsString, MinLength } from "class-validator";

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  userId!: string;

  @IsString()
  @MinLength(1)
  songId!: string;
}
