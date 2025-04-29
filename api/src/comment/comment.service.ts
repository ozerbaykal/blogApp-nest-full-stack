import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment-dto';
import { User } from 'src/user/schemas/user.schemas';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService,
  ) {}

  async create(postId: string, createCommentDto: CreateCommentDto, user: User) {
    //gönderi id'si geçerli mi kontrol et
    await this.postService.findOne(postId);

    //yeni yorum oluştur
    const newComment = new this.commentModel({
      ...createCommentDto,
      post: postId,
      author: user.id,
    });
    //yorumu kaydet  ve döndür
    return await newComment.save();
  }

  async delete(id: string, user: User) {}
  async findAllByPost(postId: string) {}
}
