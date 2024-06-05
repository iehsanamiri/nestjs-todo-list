import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TodoList } from 'src/user/domain/entities/todo-list.entity';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [TodoList], default: [] })
  todoLists: TodoList[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
