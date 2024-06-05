import { UserRepository } from '../repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const user = new User(null, username, []);
    return await this.userRepository.save(user, hashedPassword);
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
