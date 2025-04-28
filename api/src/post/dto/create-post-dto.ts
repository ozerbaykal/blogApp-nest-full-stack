import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsArray()
  @IsNotEmpty()
  tags: string[];
}
