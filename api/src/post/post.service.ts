import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { User } from 'src/user/schemas/user.schemas';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const newPost = await this.postModel.create({
      ...createPostDto,
      author: user._id,
    });
    return newPost.save();
  }

  //hem postları hem toplam sayfayı alıcak sorguları aynı anda çalıştırdık
  async findAll(
    page: number = 1,
    limit: number = 10,
    user?: User,
  ): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    const [posts, total] = await Promise.all([
      this.postModel
        .find(user ? { author: user._id } : {})
        .populate('author')
        .populate('commentCount')
        .skip((page - 1) * limit)
        .limit(limit),

      this.postModel.countDocuments(),
    ]);
    return { total, totalPages: Math.ceil(total / limit), posts };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  async update(id: string, user: User, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.author.toString() !== user._id!.toString()) {
      throw new ForbiddenException('You are not allowed to update this post');
    }

    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }
  //postu silme
  async delete(id: string, user: User) {
    //postu bul
    const post = await this.postModel.findById(id);

    //post bulunamadıysa hata döndür
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    //postun sahibi kullanıcı değilse hata döndür
    if (post.author.toString() !== user._id.toString()) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
    //postu sil
    return this.postModel.findByIdAndDelete(id);
  }
}
