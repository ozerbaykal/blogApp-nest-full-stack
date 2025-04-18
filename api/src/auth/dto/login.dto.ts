import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class loginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
