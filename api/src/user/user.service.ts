import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    return 'create';
  }
}
