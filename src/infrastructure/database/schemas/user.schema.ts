import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TodoList, todoListToDomain } from './todo-list.schema';
import { User as UserEntity } from '../../../domain/entities/user.entity';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Types.ObjectId], ref: TodoList.name, default: [] })
  todoLists: TodoList[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export function toDomain(userDoc: UserDocument): UserEntity {
  return new UserEntity(
    userDoc.id,
    userDoc.username,
    userDoc.password,
    userDoc.todoLists.map((e) => todoListToDomain(e)),
  );
}
