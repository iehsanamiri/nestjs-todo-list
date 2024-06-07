import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';
import {
  toDomain, User as DBUser,
  UserDocument,
} from 'src/infrastructure/database/schemas/user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(@InjectModel(DBUser.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    let userDoc = new this.userModel({
      username: user.username,
      password: user.password,
    });
    userDoc = await userDoc.save();
    return toDomain(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id).exec();
    return userDoc ? toDomain(userDoc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ username }).exec();
    return userDoc ? toDomain(userDoc) : null;
  }

  async update(user: User): Promise<User> {
    const userDoc = await this.userModel
      .findByIdAndUpdate(user.id, user, { new: true })
      .exec();
    return toDomain(userDoc);
  }
}
