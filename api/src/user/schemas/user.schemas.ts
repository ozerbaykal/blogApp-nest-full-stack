import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
@Schema({
  timestamps: true,
})
export class User extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: ' ' })
  refreshToken: string;

  @Prop({
    default:
      'https://static.vecteezy.com/system/resources/previews/013/360/247/non_2x/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg',
  })
  profilePicture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//kulalnıcıyı kayıt etmeden önce şifre değiştirdiyse onu hashle

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {}

  next();
});

// Duyarlı verileri JSON'da göstermemek için transform
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.refreshToken;
    return ret;
  },
});
