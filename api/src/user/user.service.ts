import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  //user modelini inject et
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  //user oluştur
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }
  //bütün kullanıcıları getir
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }
  //id ile kullanıcı getir
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  //kullanıcıyı güncelle
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }
  //kullanıcıyı sil
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return deletedUser;
  }
  //refresh token güncelleyecek fonksiyon
  async setRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  //refresh token i kaldır
  async removeRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }
  //kullanıcının refresh token i var mı kontrol et
  async hasRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user.refreshToken === refreshToken;
  }
}
