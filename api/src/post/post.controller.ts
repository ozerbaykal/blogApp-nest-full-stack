import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { Request as Req } from 'express';
import { User } from 'src/user/schemas/user.schemas';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //post oluşturma
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: Req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(req.user as unknown as User, createPostDto);
  }
  //postları getirme
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.postService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }
  //postu güncelleme
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: Req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(
      id,
      req.user as unknown as User,
      updatePostDto,
    );
  }
  //postu silme
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: Req) {
    return this.postService.delete(id, req.user as unknown as User);
  }
}
