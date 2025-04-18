import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: ' ' })
  refreshToken: string;

  @Prop({ default: ' ' })
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
