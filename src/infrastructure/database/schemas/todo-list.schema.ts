import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TodoItem, todoItemToDomain } from './todo-item.schema';
import { TodoList as TodoListEntity } from '../../../domain/entities/todo-list.entity';

@Schema()
export class TodoList extends Document {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop({ type: [TodoItem], ref: TodoItem.name })
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

// export interface TodoListDocument extends Document {
//   userId: string;
//   title: string;
//   todoItems: TodoItemDocument[];
// }
//
// export const TodoListSchema = new Schema({
//   userId: { type: String, required: true },
//   title: { type: String, required: true },
//   todoItems: [{ type: TodoItemDocument., ref: 'TodoItem' }],
// });
