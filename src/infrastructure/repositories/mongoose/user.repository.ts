import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { UserDocument } from 'src/infrastructure/database/schemas/user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(user: User, password: string): Promise<User> {
    let userDoc = new this.userModel({
      username: user.username,
      password,
    });
    userDoc = await userDoc.save();
    return this.toDomain(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ username }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  private toDomain(userDoc: UserDocument): User {
    return new User(userDoc.id, userDoc.username, userDoc.todoLists);
  }
}
