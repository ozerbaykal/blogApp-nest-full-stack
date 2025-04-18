import { IsEmail, IsOptional } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
