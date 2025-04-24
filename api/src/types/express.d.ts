import { User } from './../user/schemas/user.schemas';
import { global } from './../../node_modules/webpack/types.d';
import { User } from 'src/user/schemas/user.schemas';

declare global {
  namespace Express {
    interface User {
      _id: string;
      username: string;
      email: string;
      profilePicture: string;
    }
  }
}
