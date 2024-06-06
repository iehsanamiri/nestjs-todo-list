import { UserRepository } from '../repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }
}
