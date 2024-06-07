import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TodoItem, todoItemToDomain } from './todo-item.schema';
import { TodoList as TodoListEntity } from '../../../domain/entities/todo-list.entity';

@Schema()
export class TodoList extends Document {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop({ type: [Types.ObjectId], ref: TodoList.name, default: [] })
  todoItems: TodoItem[];
}

export type TodoListDocument = TodoList & Document;
export const TodoListSchema = SchemaFactory.createForClass(TodoList);

export function todoListToDomain(
  todoListDoc: TodoListDocument,
): TodoListEntity {
  return new TodoListEntity(
    todoListDoc.id,
    todoListDoc.userId,
    todoListDoc.title,
    todoListDoc.todoItems.map((e) => todoItemToDomain(e)),
  );
}