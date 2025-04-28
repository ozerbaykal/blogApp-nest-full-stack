import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { User } from 'src/user/schemas/user.schemas';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(user: User, createPostDto: CreatePostDto) {
    const createdPost = await this.postModel.create({
      ...createPostDto,
    });
    return createdPost;
  }

  async findAll() {
    return this.postModel.find();
  }

  async findOne(id: string) {
    return this.postModel.findById(id);
  }
  async update(id: string, user: User, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }
  async delete(id: string, user: User) {
    return this.postModel.findByIdAndDelete(id);
  }
}
