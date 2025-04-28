import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../user/schemas/user.schemas';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
@Schema({
  timestamps: true,
})
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true })
  tags: string[];

  @Prop()
  photo: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
