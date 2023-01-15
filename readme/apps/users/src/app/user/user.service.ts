import {Injectable} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserEntity} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}
  async incrementPostsCount(id: string) {
    const user = await this.userRepository.findById(id);
    const postsCount = user.postsCount + 1;
    const userEntity = new UserEntity({ ...user, postsCount });

    return await this.userRepository.update(id, userEntity);
  }
}
