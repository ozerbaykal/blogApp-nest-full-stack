import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { Request as Req } from 'express';
import { User } from 'src/user/schemas/user.schemas';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/post/:postId/comments')
  findAllByPost(@Param('postId') postId: string) {
    return this.commentService.findAllByPost(postId);
  }

  @Post('/post/:postId/comments')
  create(
    @Param('postId') postId: string,
    @Body()
    createCommentDto: CreateCommentDto,
    @Request() req: Req,
  ) {
    return this.commentService.create(
      postId,
      createCommentDto,
      req.user as unknown as User,
    );
  }
  @Delete('/comments/:id')
  delete(@Param('id') id: string, @Request() req: Req) {
    return this.commentService.delete(id, req.user as unknown as User);
  }
}
