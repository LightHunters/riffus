import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
